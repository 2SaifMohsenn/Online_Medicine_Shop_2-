from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth.hashers import make_password
from rest_framework import status
from .models import Medicine, User, Admin, Order, OrderItem
import json

class MedicineModelTest(TestCase):
    def setUp(self):
        self.medicine = Medicine.objects.create(
            name="Paracetamol",
            description="Pain relief",
            category="Pain Relief",
            price=10.50,
            stock=100
        )

    def test_medicine_creation(self):
        self.assertEqual(self.medicine.name, "Paracetamol")
        self.assertEqual(self.medicine.__str__(), "Paracetamol")

class UserModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create(
            first_name="John",
            last_name="Doe",
            email="john@example.com",
            password=make_password("password123"),
            shipping_address="123 Street"
        )

    def test_user_creation(self):
        self.assertEqual(self.user.email, "john@example.com")
        self.assertEqual(self.user.__str__(), "John Doe")

class AuthAPITest(TestCase):
    def setUp(self):
        self.client = Client()
        self.signup_url = reverse('signup')
        self.login_url = reverse('login')
        self.user_password = "password123"
        self.user = User.objects.create(
            first_name="Jane",
            last_name="Doe",
            email="jane@example.com",
            password=make_password(self.user_password),
            shipping_address="456 Avenue"
        )
        self.admin = Admin.objects.create(
            first_name="Admin",
            last_name="User",
            email="admin@example.com",
            password=make_password("adminpass")
        )

    def test_signup_success(self):
        data = {
            "first_name": "New",
            "last_name": "User",
            "email": "new@example.com",
            "password": "newpassword123",
            "address": "789 Road"
        }
        response = self.client.post(self.signup_url, data=json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(email="new@example.com").exists())

    def test_signup_existing_email(self):
        data = {
            "first_name": "Jane",
            "last_name": "Doe",
            "email": "jane@example.com",
            "password": "password123"
        }
        response = self.client.post(self.signup_url, data=json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_login_user_success(self):
        data = {
            "email": "jane@example.com",
            "password": self.user_password
        }
        response = self.client.post(self.login_url, data=json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['role'], 'user')

    def test_login_admin_success(self):
        data = {
            "email": "admin@example.com",
            "password": "adminpass"
        }
        response = self.client.post(self.login_url, data=json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['role'], 'admin')

    def test_login_invalid_credentials(self):
        data = {
            "email": "jane@example.com",
            "password": "wrongpassword"
        }
        response = self.client.post(self.login_url, data=json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

class OrderAPITest(TestCase):
    def setUp(self):
        self.client = Client()
        self.create_order_url = reverse('create_order')
        self.user = User.objects.create(
            first_name="Order",
            last_name="Tester",
            email="tester@example.com",
            password=make_password("pass")
        )
        self.medicine = Medicine.objects.create(
            name="Aspirin",
            price=5.00,
            stock=50,
            category="Pain Relief"
        )

    def test_create_order_success(self):
        data = {
            "user_id": self.user.id,
            "total_price": 10.00,
            "items": [
                {
                    "medicine_id": self.medicine.id,
                    "quantity": 2,
                    "price": 5.00
                }
            ]
        }
        response = self.client.post(self.create_order_url, data=json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # Check stock reduction
        self.medicine.refresh_from_db()
        self.assertEqual(self.medicine.stock, 48)
        
        # Check order creation
        self.assertEqual(Order.objects.count(), 1)
        self.assertEqual(OrderItem.objects.count(), 1)

    def test_create_order_insufficient_stock(self):
        data = {
            "user_id": self.user.id,
            "total_price": 300.00,
            "items": [
                {
                    "medicine_id": self.medicine.id,
                    "quantity": 60, # More than stock (50)
                    "price": 5.00
                }
            ]
        }
        response = self.client.post(self.create_order_url, data=json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("Insufficient stock", response.data['error'])

class DashboardStatsTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.stats_url = reverse('dashboard_stats')
        self.user = User.objects.create(first_name="U1", email="u1@ex.com")
        self.medicine_low = Medicine.objects.create(name="Low", price=1, stock=5, category="Vitamins")
        self.medicine_high = Medicine.objects.create(name="High", price=1, stock=20, category="Vitamins")
        self.order = Order.objects.create(user=self.user, total_price=100.00, is_paid=True)

    def test_get_dashboard_stats(self):
        response = self.client.get(self.stats_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['total_users'], 1)
        self.assertEqual(response.data['total_orders'], 1)
        self.assertEqual(response.data['total_revenue'], 100.00)
        self.assertEqual(response.data['low_stock_count'], 1)
