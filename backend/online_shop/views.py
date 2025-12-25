from django.shortcuts import render
from django.contrib.auth.hashers import make_password, check_password

# Create your views here.
from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Medicine, User, Admin, Order, OrderItem
from .serializers import MedicineSerializer, UserSerializer, AdminSerializer, OrderSerializer, OrderItemSerializer

class MedicineViewSet(viewsets.ModelViewSet):
    queryset = Medicine.objects.all()
    serializer_class = MedicineSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class AdminViewSet(viewsets.ModelViewSet):
    queryset = Admin.objects.all()
    serializer_class = AdminSerializer

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

class OrderItemViewSet(viewsets.ModelViewSet):
    queryset = OrderItem.objects.all()
    serializer_class = OrderItemSerializer


@api_view(['POST'])
def signup(request):
    """
    Register a new user with hashed password.
    Expects: name, email, password, phone (optional), address
    """
    try:
        data = request.data
        name = data.get('name', '')
        email = data.get('email', '')
        password = data.get('password', '')
        phone = data.get('phone', '')
        address = data.get('address', '')

        # Validate required fields
        if not name or not email or not password:
            return Response(
                {'error': 'Name, email, and password are required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check if user already exists
        if User.objects.filter(email=email).exists():
            return Response(
                {'error': 'A user with this email already exists'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Split name into first and last name
        name_parts = name.strip().split(' ', 1)
        first_name = name_parts[0]
        last_name = name_parts[1] if len(name_parts) > 1 else ''

        # Create user with hashed password
        user = User.objects.create(
            first_name=first_name,
            last_name=last_name,
            email=email,
            password=make_password(password),
            shipping_address=address
        )

        return Response({
            'message': 'User created successfully',
            'user': {
                'id': user.id,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'email': user.email
            }
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
def login(request):
    """
    Authenticate a user or admin by email and password.
    Returns user/admin data with role type.
    """
    try:
        data = request.data
        email = data.get('email', '')
        password = data.get('password', '')

        # Validate required fields
        if not email or not password:
            return Response(
                {'error': 'Email and password are required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # First, check if it's an admin
        try:
            admin = Admin.objects.get(email=email)
            if check_password(password, admin.password):
                return Response({
                    'message': 'Login successful',
                    'role': 'admin',
                    'user': {
                        'id': admin.id,
                        'first_name': admin.first_name,
                        'last_name': admin.last_name,
                        'email': admin.email
                    }
                }, status=status.HTTP_200_OK)
        except Admin.DoesNotExist:
            pass  # Not an admin, check user table

        # Check if it's a regular user
        try:
            user = User.objects.get(email=email)
            if check_password(password, user.password):
                return Response({
                    'message': 'Login successful',
                    'role': 'user',
                    'user': {
                        'id': user.id,
                        'first_name': user.first_name,
                        'last_name': user.last_name,
                        'email': user.email,
                        'shipping_address': user.shipping_address
                    }
                }, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            pass

        # If we get here, credentials are invalid
        return Response(
            {'error': 'Invalid email or password'},
            status=status.HTTP_401_UNAUTHORIZED
        )

    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['PUT'])
def update_user_profile(request):
    """
    Update user profile information.
    Expects: user_id, first_name, last_name, shipping_address
    """
    try:
        data = request.data
        user_id = data.get('user_id')
        first_name = data.get('first_name', '')
        last_name = data.get('last_name', '')
        shipping_address = data.get('shipping_address', '')

        if not user_id:
            return Response(
                {'error': 'User ID is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response(
                {'error': 'User not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        # Update fields
        if first_name:
            user.first_name = first_name
        if last_name:
            user.last_name = last_name
        user.shipping_address = shipping_address
        user.save()

        return Response({
            'message': 'Profile updated successfully',
            'user': {
                'id': user.id,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'email': user.email,
                'shipping_address': user.shipping_address
            }
        }, status=status.HTTP_200_OK)

    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['PUT'])
def update_admin_profile(request):
    """
    Update admin profile information.
    Expects: admin_id, first_name, last_name
    """
    try:
        data = request.data
        admin_id = data.get('admin_id')
        first_name = data.get('first_name', '')
        last_name = data.get('last_name', '')

        if not admin_id:
            return Response(
                {'error': 'Admin ID is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            admin = Admin.objects.get(id=admin_id)
        except Admin.DoesNotExist:
            return Response(
                {'error': 'Admin not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        # Update fields
        if first_name:
            admin.first_name = first_name
        if last_name:
            admin.last_name = last_name
        admin.save()

        return Response({
            'message': 'Profile updated successfully',
            'user': {
                'id': admin.id,
                'first_name': admin.first_name,
                'last_name': admin.last_name,
                'email': admin.email
            }
        }, status=status.HTTP_200_OK)

    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['PUT'])
def change_password(request):
    """
    Change password for user or admin.
    Expects: user_id, role ('user' or 'admin'), current_password, new_password
    """
    try:
        data = request.data
        user_id = data.get('user_id')
        role = data.get('role', 'user')
        current_password = data.get('current_password', '')
        new_password = data.get('new_password', '')

        if not user_id or not current_password or not new_password:
            return Response(
                {'error': 'User ID, current password, and new password are required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if len(new_password) < 3:
            return Response(
                {'error': 'New password must be at least 3 characters'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Get user or admin based on role
        if role == 'admin':
            try:
                account = Admin.objects.get(id=user_id)
            except Admin.DoesNotExist:
                return Response(
                    {'error': 'Admin not found'},
                    status=status.HTTP_404_NOT_FOUND
                )
        else:
            try:
                account = User.objects.get(id=user_id)
            except User.DoesNotExist:
                return Response(
                    {'error': 'User not found'},
                    status=status.HTTP_404_NOT_FOUND
                )

        # Verify current password
        if not check_password(current_password, account.password):
            return Response(
                {'error': 'Current password is incorrect'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        # Update password
        account.password = make_password(new_password)
        account.save()

        return Response({
            'message': 'Password changed successfully'
        }, status=status.HTTP_200_OK)

    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
def get_dashboard_stats(request):
    """
    Get dashboard statistics.
    Returns: total_users, total_orders, total_revenue, low_stock_count
    """
    try:
        total_users = User.objects.count()
        total_orders = Order.objects.count()
        
        # Calculate total revenue from paid orders
        from django.db.models import Sum
        total_revenue = Order.objects.filter(is_paid=True).aggregate(Sum('total_price'))['total_price__sum'] or 0
        
        # Count medicines with low stock (less than 10 items)
        low_stock_count = Medicine.objects.filter(stock__lt=10).count()
        
        return Response({
            'total_users': total_users,
            'total_orders': total_orders,
            'total_revenue': float(total_revenue),
            'low_stock_count': low_stock_count,
        }, status=status.HTTP_200_OK)

    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


from django.db import transaction

@api_view(['POST'])
def create_order(request):
    """
    Create a new order with items and update stock.
    Expects: user_id, items (array of {medicine_id, quantity, price}), total_price
    """
    print(f"--- Received Create Order Request ---")
    print(f"Data: {request.data}")
    
    try:
        data = request.data
        user_id = data.get('user_id')
        items = data.get('items', [])
        total_price = data.get('total_price', 0)

        # Validate required fields
        if not user_id:
            return Response({'error': 'User ID is required'}, status=status.HTTP_400_BAD_REQUEST)

        if not items or len(items) == 0:
            return Response({'error': 'Order must contain at least one item'}, status=status.HTTP_400_BAD_REQUEST)

        # Get user
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        with transaction.atomic():
            # 1. Validation Phase: Check stock for all items first
            medicines_to_update = []
            for item in items:
                medicine_id = item.get('medicine_id')
                qty_ordered = item.get('quantity', 1)
                
                try:
                    medicine = Medicine.objects.select_for_update().get(id=medicine_id)
                    if medicine.stock < qty_ordered:
                        return Response({
                            'error': f'Insufficient stock for {medicine.name}. Available: {medicine.stock}, Ordered: {qty_ordered}'
                        }, status=status.HTTP_400_BAD_REQUEST)
                    
                    medicines_to_update.append((medicine, qty_ordered))
                except Medicine.DoesNotExist:
                    return Response({'error': f'Medicine with ID {medicine_id} not found'}, status=status.HTTP_404_NOT_FOUND)

            # 2. Execution Phase: Create Order and Items, and Update Stock
            order = Order.objects.create(
                user=user,
                total_price=total_price,
                is_paid=True
            )

            for medicine, qty in medicines_to_update:
                # Create Order Item
                OrderItem.objects.create(
                    order=order,
                    medicine=medicine,
                    quantity=qty,
                    price=medicine.price * qty # Use current medicine price
                )
                
                # Reduce Stock
                medicine.stock -= qty
                medicine.save()

            return Response({
                'message': 'Order created successfully and stock updated',
                'order_id': order.id,
                'total_price': float(order.total_price)
            }, status=status.HTTP_201_CREATED)

    except Exception as e:
        print(f"Error creating order: {str(e)}")
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
