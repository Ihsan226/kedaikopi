<?php
/**
 * Database Configuration for Kedai Kopi
 * Konfigurasi koneksi database untuk website Kedai Kopi
 */

// Database Configuration
define('DB_HOST', 'localhost');
define('DB_NAME', 'kedai_kopi');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_CHARSET', 'utf8mb4');

// Database Connection Class
class Database {
    private $host = DB_HOST;
    private $db_name = DB_NAME;
    private $username = DB_USER;
    private $password = DB_PASS;
    private $charset = DB_CHARSET;
    private $pdo;

    /**
     * Get database connection
     */
    public function getConnection() {
        $this->pdo = null;
        
        try {
            $dsn = "mysql:host=" . $this->host . ";dbname=" . $this->db_name . ";charset=" . $this->charset;
            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ];
            
            $this->pdo = new PDO($dsn, $this->username, $this->password, $options);
        } catch(PDOException $e) {
            echo "Connection Error: " . $e->getMessage();
        }
        
        return $this->pdo;
    }
}

/**
 * Simple Database Helper Functions
 */
class DB {
    private static $instance = null;
    private $connection;

    private function __construct() {
        $database = new Database();
        $this->connection = $database->getConnection();
    }

    public static function getInstance() {
        if (self::$instance == null) {
            self::$instance = new DB();
        }
        return self::$instance;
    }

    public function getConnection() {
        return $this->connection;
    }

    /**
     * Execute a query and return results
     */
    public function query($sql, $params = []) {
        try {
            $stmt = $this->connection->prepare($sql);
            $stmt->execute($params);
            return $stmt;
        } catch(PDOException $e) {
            error_log("Database Query Error: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Get all records
     */
    public function fetchAll($sql, $params = []) {
        $stmt = $this->query($sql, $params);
        return $stmt ? $stmt->fetchAll() : [];
    }

    /**
     * Get single record
     */
    public function fetch($sql, $params = []) {
        $stmt = $this->query($sql, $params);
        return $stmt ? $stmt->fetch() : null;
    }

    /**
     * Execute insert/update/delete
     */
    public function execute($sql, $params = []) {
        $stmt = $this->query($sql, $params);
        return $stmt ? $stmt->rowCount() : 0;
    }

    /**
     * Get last insert ID
     */
    public function lastInsertId() {
        return $this->connection->lastInsertId();
    }
}

// Example usage functions for API endpoints

/**
 * Get all products with category info
 */
function getProducts($category = null, $limit = null, $search = null) {
    $db = DB::getInstance();
    
    $sql = "SELECT p.*, c.name as category_name, 
                   (SELECT image_path FROM product_images pi WHERE pi.product_id = p.id AND pi.is_primary = 1 LIMIT 1) as primary_image
            FROM products p 
            LEFT JOIN categories c ON p.category_id = c.id 
            WHERE p.status = 'active'";
    
    $params = [];
    
    if ($category) {
        $sql .= " AND c.slug = ?";
        $params[] = $category;
    }
    
    if ($search) {
        $sql .= " AND (p.name LIKE ? OR p.description LIKE ?)";
        $searchTerm = '%' . $search . '%';
        $params[] = $searchTerm;
        $params[] = $searchTerm;
    }
    
    $sql .= " ORDER BY p.created_at DESC";
    
    if ($limit) {
        $sql .= " LIMIT ?";
        $params[] = $limit;
    }
    
    return $db->fetchAll($sql, $params);
}

/**
 * Get product by ID with all details
 */
function getProductById($id) {
    $db = DB::getInstance();
    
    // Get product details
    $sql = "SELECT p.*, c.name as category_name, c.slug as category_slug
            FROM products p 
            LEFT JOIN categories c ON p.category_id = c.id 
            WHERE p.id = ? AND p.status = 'active'";
    
    $product = $db->fetch($sql, [$id]);
    
    if ($product) {
        // Get product images
        $product['images'] = $db->fetchAll(
            "SELECT * FROM product_images WHERE product_id = ? ORDER BY sort_order",
            [$id]
        );
        
        // Get product variants
        $product['variants'] = $db->fetchAll(
            "SELECT * FROM product_variants WHERE product_id = ? ORDER BY id",
            [$id]
        );
        
        // Get reviews
        $product['reviews'] = $db->fetchAll(
            "SELECT r.*, u.name as user_name 
             FROM reviews r 
             LEFT JOIN users u ON r.user_id = u.id 
             WHERE r.product_id = ? AND r.status = 'approved' 
             ORDER BY r.created_at DESC LIMIT 10",
            [$id]
        );
    }
    
    return $product;
}

/**
 * Create new order
 */
function createOrder($orderData) {
    $db = DB::getInstance();
    
    try {
        $db->getConnection()->beginTransaction();
        
        // Generate order number
        $stmt = $db->query("CALL GenerateOrderNumber(@order_number)");
        $orderNumber = $db->fetch("SELECT @order_number as order_number")['order_number'];
        
        // Insert order
        $sql = "INSERT INTO orders (order_number, user_id, customer_name, customer_email, customer_phone, 
                                  shipping_address, shipping_city, shipping_province, shipping_postal_code,
                                  payment_method, subtotal, shipping_cost, discount_amount, total_amount, notes) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        
        $params = [
            $orderNumber,
            $orderData['user_id'] ?? null,
            $orderData['customer_name'],
            $orderData['customer_email'],
            $orderData['customer_phone'],
            $orderData['shipping_address'],
            $orderData['shipping_city'],
            $orderData['shipping_province'],
            $orderData['shipping_postal_code'],
            $orderData['payment_method'],
            $orderData['subtotal'],
            $orderData['shipping_cost'],
            $orderData['discount_amount'] ?? 0,
            $orderData['total_amount'],
            $orderData['notes'] ?? ''
        ];
        
        $db->execute($sql, $params);
        $orderId = $db->lastInsertId();
        
        // Insert order items
        foreach ($orderData['items'] as $item) {
            $sql = "INSERT INTO order_items (order_id, product_id, product_name, product_sku, 
                                           variant_info, quantity, unit_price, total_price) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
            
            $itemParams = [
                $orderId,
                $item['product_id'],
                $item['product_name'],
                $item['product_sku'] ?? '',
                json_encode($item['variant_info'] ?? []),
                $item['quantity'],
                $item['unit_price'],
                $item['total_price']
            ];
            
            $db->execute($sql, $itemParams);
        }
        
        $db->getConnection()->commit();
        return ['success' => true, 'order_id' => $orderId, 'order_number' => $orderNumber];
        
    } catch (Exception $e) {
        $db->getConnection()->rollback();
        return ['success' => false, 'error' => $e->getMessage()];
    }
}

/**
 * Get user orders
 */
function getUserOrders($userId, $limit = 10) {
    $db = DB::getInstance();
    
    return $db->fetchAll(
        "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC LIMIT ?",
        [$userId, $limit]
    );
}

/**
 * Update order status
 */
function updateOrderStatus($orderId, $status, $notes = '') {
    $db = DB::getInstance();
    
    $sql = "UPDATE orders SET status = ?, notes = CONCAT(COALESCE(notes, ''), ?) WHERE id = ?";
    $noteText = $notes ? "\n" . date('Y-m-d H:i:s') . ": " . $notes : '';
    
    return $db->execute($sql, [$status, $noteText, $orderId]) > 0;
}

/**
 * Authentication functions
 */
function authenticateUser($email, $password) {
    $db = DB::getInstance();
    
    $user = $db->fetch(
        "SELECT * FROM users WHERE email = ? AND role = 'user'",
        [$email]
    );
    
    if ($user && password_verify($password, $user['password'])) {
        unset($user['password']);
        return $user;
    }
    
    return false;
}

function createUser($userData) {
    $db = DB::getInstance();
    
    // Check if email already exists
    $existing = $db->fetch("SELECT id FROM users WHERE email = ?", [$userData['email']]);
    if ($existing) {
        return ['success' => false, 'error' => 'Email sudah terdaftar'];
    }
    
    // Hash password
    $hashedPassword = password_hash($userData['password'], PASSWORD_DEFAULT);
    
    $sql = "INSERT INTO users (name, email, password, phone, address, city, province, postal_code) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    
    $params = [
        $userData['name'],
        $userData['email'],
        $hashedPassword,
        $userData['phone'] ?? '',
        $userData['address'] ?? '',
        $userData['city'] ?? '',
        $userData['province'] ?? '',
        $userData['postal_code'] ?? ''
    ];
    
    if ($db->execute($sql, $params)) {
        return ['success' => true, 'user_id' => $db->lastInsertId()];
    }
    
    return ['success' => false, 'error' => 'Gagal membuat akun'];
}

// Response helper function
function jsonResponse($data, $status = 200) {
    http_response_code($status);
    header('Content-Type: application/json');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

// CORS headers for API
function setCorsHeaders() {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        exit(0);
    }
}

?>
