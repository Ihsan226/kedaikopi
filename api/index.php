<?php
/**
 * API Endpoints for Kedai Kopi
 * RESTful API untuk website e-commerce Kedai Kopi
 */

require_once '../database/config.php';

// Set CORS headers
setCorsHeaders();

// Get request method and path
$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$pathParts = explode('/', trim($path, '/'));

// Remove 'api' from path parts if present
if (isset($pathParts[1]) && $pathParts[1] === 'api') {
    array_shift($pathParts);
    array_shift($pathParts);
} else if (isset($pathParts[0]) && $pathParts[0] === 'api') {
    array_shift($pathParts);
}

$endpoint = $pathParts[0] ?? '';
$id = $pathParts[1] ?? null;

// Route requests
switch ($endpoint) {
    case 'products':
        handleProductsAPI($method, $id);
        break;
    case 'categories':
        handleCategoriesAPI($method, $id);
        break;
    case 'orders':
        handleOrdersAPI($method, $id);
        break;
    case 'auth':
        handleAuthAPI($method, $id);
        break;
    case 'cart':
        handleCartAPI($method, $id);
        break;
    default:
        jsonResponse(['error' => 'Endpoint not found'], 404);
}

/**
 * Products API Handler
 */
function handleProductsAPI($method, $id) {
    switch ($method) {
        case 'GET':
            if ($id) {
                // Get single product
                $product = getProductById($id);
                if ($product) {
                    jsonResponse(['success' => true, 'data' => $product]);
                } else {
                    jsonResponse(['error' => 'Product not found'], 404);
                }
            } else {
                // Get all products with filters
                $category = $_GET['category'] ?? null;
                $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : null;
                $search = $_GET['search'] ?? null;
                
                $products = getProducts($category, $limit, $search);
                jsonResponse(['success' => true, 'data' => $products]);
            }
            break;
        
        case 'POST':
            // Create new product (admin only)
            $data = json_decode(file_get_contents('php://input'), true);
            $result = createProduct($data);
            jsonResponse($result, $result['success'] ? 201 : 400);
            break;
            
        case 'PUT':
            // Update product (admin only)
            if (!$id) {
                jsonResponse(['error' => 'Product ID required'], 400);
            }
            $data = json_decode(file_get_contents('php://input'), true);
            $result = updateProduct($id, $data);
            jsonResponse($result, $result['success'] ? 200 : 400);
            break;
            
        case 'DELETE':
            // Delete product (admin only)
            if (!$id) {
                jsonResponse(['error' => 'Product ID required'], 400);
            }
            $result = deleteProduct($id);
            jsonResponse($result, $result['success'] ? 200 : 400);
            break;
            
        default:
            jsonResponse(['error' => 'Method not allowed'], 405);
    }
}

/**
 * Categories API Handler
 */
function handleCategoriesAPI($method, $id) {
    switch ($method) {
        case 'GET':
            $categories = getCategories();
            jsonResponse(['success' => true, 'data' => $categories]);
            break;
            
        default:
            jsonResponse(['error' => 'Method not allowed'], 405);
    }
}

/**
 * Orders API Handler
 */
function handleOrdersAPI($method, $id) {
    switch ($method) {
        case 'GET':
            if ($id) {
                // Get single order
                $order = getOrderById($id);
                if ($order) {
                    jsonResponse(['success' => true, 'data' => $order]);
                } else {
                    jsonResponse(['error' => 'Order not found'], 404);
                }
            } else {
                // Get user orders
                $userId = $_GET['user_id'] ?? null;
                if (!$userId) {
                    jsonResponse(['error' => 'User ID required'], 400);
                }
                $orders = getUserOrders($userId);
                jsonResponse(['success' => true, 'data' => $orders]);
            }
            break;
            
        case 'POST':
            // Create new order
            $data = json_decode(file_get_contents('php://input'), true);
            $result = createOrder($data);
            jsonResponse($result, $result['success'] ? 201 : 400);
            break;
            
        case 'PUT':
            // Update order status
            if (!$id) {
                jsonResponse(['error' => 'Order ID required'], 400);
            }
            $data = json_decode(file_get_contents('php://input'), true);
            $status = $data['status'] ?? '';
            $notes = $data['notes'] ?? '';
            
            $result = updateOrderStatus($id, $status, $notes);
            if ($result) {
                jsonResponse(['success' => true, 'message' => 'Order status updated']);
            } else {
                jsonResponse(['error' => 'Failed to update order'], 400);
            }
            break;
            
        default:
            jsonResponse(['error' => 'Method not allowed'], 405);
    }
}

/**
 * Authentication API Handler
 */
function handleAuthAPI($method, $action) {
    switch ($method) {
        case 'POST':
            $data = json_decode(file_get_contents('php://input'), true);
            
            switch ($action) {
                case 'login':
                    $email = $data['email'] ?? '';
                    $password = $data['password'] ?? '';
                    
                    $user = authenticateUser($email, $password);
                    if ($user) {
                        // Start session
                        session_start();
                        $_SESSION['user_id'] = $user['id'];
                        $_SESSION['user_email'] = $user['email'];
                        $_SESSION['user_name'] = $user['name'];
                        
                        jsonResponse([
                            'success' => true,
                            'message' => 'Login successful',
                            'user' => $user
                        ]);
                    } else {
                        jsonResponse(['error' => 'Invalid credentials'], 401);
                    }
                    break;
                    
                case 'register':
                    $result = createUser($data);
                    jsonResponse($result, $result['success'] ? 201 : 400);
                    break;
                    
                case 'logout':
                    session_start();
                    session_destroy();
                    jsonResponse(['success' => true, 'message' => 'Logged out successfully']);
                    break;
                    
                default:
                    jsonResponse(['error' => 'Invalid auth action'], 400);
            }
            break;
            
        default:
            jsonResponse(['error' => 'Method not allowed'], 405);
    }
}

/**
 * Cart API Handler
 */
function handleCartAPI($method, $action) {
    switch ($method) {
        case 'GET':
            // Get cart items
            session_start();
            $userId = $_SESSION['user_id'] ?? null;
            $sessionId = session_id();
            
            $cartItems = getCartItems($userId, $sessionId);
            jsonResponse(['success' => true, 'data' => $cartItems]);
            break;
            
        case 'POST':
            // Add to cart
            $data = json_decode(file_get_contents('php://input'), true);
            session_start();
            $userId = $_SESSION['user_id'] ?? null;
            $sessionId = session_id();
            
            $result = addToCartDB($userId, $sessionId, $data);
            jsonResponse($result, $result['success'] ? 201 : 400);
            break;
            
        case 'PUT':
            // Update cart item
            $data = json_decode(file_get_contents('php://input'), true);
            $result = updateCartItem($data);
            jsonResponse($result, $result['success'] ? 200 : 400);
            break;
            
        case 'DELETE':
            // Remove from cart
            if ($action) {
                $result = removeFromCart($action);
                jsonResponse($result, $result['success'] ? 200 : 400);
            } else {
                jsonResponse(['error' => 'Cart item ID required'], 400);
            }
            break;
            
        default:
            jsonResponse(['error' => 'Method not allowed'], 405);
    }
}

// Additional helper functions

function getCategories() {
    $db = DB::getInstance();
    return $db->fetchAll("SELECT * FROM categories WHERE status = 'active' ORDER BY name");
}

function createProduct($data) {
    $db = DB::getInstance();
    
    try {
        $sql = "INSERT INTO products (category_id, name, slug, description, long_description, 
                                    price, original_price, discount_percentage, sku, stock, weight, status) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        
        $params = [
            $data['category_id'],
            $data['name'],
            $data['slug'],
            $data['description'],
            $data['long_description'] ?? '',
            $data['price'],
            $data['original_price'] ?? null,
            $data['discount_percentage'] ?? 0,
            $data['sku'],
            $data['stock'],
            $data['weight'] ?? 0,
            $data['status'] ?? 'active'
        ];
        
        $db->execute($sql, $params);
        $productId = $db->lastInsertId();
        
        return ['success' => true, 'product_id' => $productId];
    } catch (Exception $e) {
        return ['success' => false, 'error' => $e->getMessage()];
    }
}

function updateProduct($id, $data) {
    $db = DB::getInstance();
    
    try {
        $sql = "UPDATE products SET category_id = ?, name = ?, description = ?, 
                                  price = ?, stock = ?, status = ?, updated_at = NOW() 
                WHERE id = ?";
        
        $params = [
            $data['category_id'],
            $data['name'],
            $data['description'],
            $data['price'],
            $data['stock'],
            $data['status'] ?? 'active',
            $id
        ];
        
        $result = $db->execute($sql, $params);
        return ['success' => $result > 0];
    } catch (Exception $e) {
        return ['success' => false, 'error' => $e->getMessage()];
    }
}

function deleteProduct($id) {
    $db = DB::getInstance();
    
    try {
        // Soft delete - just mark as inactive
        $result = $db->execute("UPDATE products SET status = 'inactive' WHERE id = ?", [$id]);
        return ['success' => $result > 0];
    } catch (Exception $e) {
        return ['success' => false, 'error' => $e->getMessage()];
    }
}

function getOrderById($id) {
    $db = DB::getInstance();
    
    // Get order details
    $order = $db->fetch(
        "SELECT * FROM orders WHERE id = ?",
        [$id]
    );
    
    if ($order) {
        // Get order items
        $order['items'] = $db->fetchAll(
            "SELECT oi.*, p.name as product_name 
             FROM order_items oi 
             LEFT JOIN products p ON oi.product_id = p.id 
             WHERE oi.order_id = ?",
            [$id]
        );
    }
    
    return $order;
}

function getCartItems($userId, $sessionId) {
    $db = DB::getInstance();
    
    $sql = "SELECT c.*, p.name as product_name, p.price, p.stock,
                   (SELECT image_path FROM product_images pi WHERE pi.product_id = c.product_id AND pi.is_primary = 1 LIMIT 1) as image
            FROM shopping_cart c
            LEFT JOIN products p ON c.product_id = p.id
            WHERE ";
    
    $params = [];
    
    if ($userId) {
        $sql .= "c.user_id = ?";
        $params[] = $userId;
    } else {
        $sql .= "c.session_id = ?";
        $params[] = $sessionId;
    }
    
    return $db->fetchAll($sql, $params);
}

function addToCartDB($userId, $sessionId, $data) {
    $db = DB::getInstance();
    
    try {
        // Check if item already exists
        $existingItem = $db->fetch(
            "SELECT id, quantity FROM shopping_cart 
             WHERE " . ($userId ? "user_id = ?" : "session_id = ?") . " 
             AND product_id = ? AND variant_info = ?",
            [
                $userId ?: $sessionId,
                $data['product_id'],
                json_encode($data['variant_info'] ?? [])
            ]
        );
        
        if ($existingItem) {
            // Update quantity
            $newQuantity = $existingItem['quantity'] + ($data['quantity'] ?? 1);
            $db->execute(
                "UPDATE shopping_cart SET quantity = ?, updated_at = NOW() WHERE id = ?",
                [$newQuantity, $existingItem['id']]
            );
        } else {
            // Insert new item
            $sql = "INSERT INTO shopping_cart (user_id, session_id, product_id, variant_info, quantity) 
                    VALUES (?, ?, ?, ?, ?)";
            
            $params = [
                $userId,
                $sessionId,
                $data['product_id'],
                json_encode($data['variant_info'] ?? []),
                $data['quantity'] ?? 1
            ];
            
            $db->execute($sql, $params);
        }
        
        return ['success' => true, 'message' => 'Item added to cart'];
    } catch (Exception $e) {
        return ['success' => false, 'error' => $e->getMessage()];
    }
}

function updateCartItem($data) {
    $db = DB::getInstance();
    
    try {
        $result = $db->execute(
            "UPDATE shopping_cart SET quantity = ? WHERE id = ?",
            [$data['quantity'], $data['cart_id']]
        );
        
        return ['success' => $result > 0];
    } catch (Exception $e) {
        return ['success' => false, 'error' => $e->getMessage()];
    }
}

function removeFromCart($cartId) {
    $db = DB::getInstance();
    
    try {
        $result = $db->execute("DELETE FROM shopping_cart WHERE id = ?", [$cartId]);
        return ['success' => $result > 0];
    } catch (Exception $e) {
        return ['success' => false, 'error' => $e->getMessage()];
    }
}

?>
