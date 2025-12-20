from django.db import models

# -----------------------
# Medicine Models
# -----------------------
class Medicine(models.Model):
    CATEGORY_CHOICES = [
        ('Vitamins', 'Vitamins'),
        ('Hair Care', 'Hair Care'),
        ('Pain Relief', 'Pain Relief'),
        ('Cold & Flu', 'Cold & Flu'),
    ]

    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    category = models.CharField(
        max_length=50, 
        choices=CATEGORY_CHOICES, 
        default='Vitamins'  # <-- default set here
    )
    price = models.DecimalField(max_digits=8, decimal_places=2)
    stock = models.PositiveIntegerField()
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    image = models.ImageField(upload_to='medicines/', blank=True, null=True)

    def __str__(self):
        return self.name


# -----------------------
# Order Models
# -----------------------
class Order(models.Model):
    user = models.ForeignKey('User', on_delete=models.CASCADE)
    medicines = models.ManyToManyField(Medicine, through='OrderItem')
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    is_paid = models.BooleanField(default=False)

    def __str__(self):
        return f"Order #{self.id} by {self.user.first_name} {self.user.last_name}"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    medicine = models.ForeignKey(Medicine, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.quantity} x {self.medicine.name}"

# -----------------------
# Shipping Address Model
# -----------------------
class ShippingAddress(models.Model):
    street_address = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    zip_code = models.CharField(max_length=20)

    def __str__(self):
        return f"{self.street_address}, {self.city}"

# -----------------------
# Custom User Model
# -----------------------
class User(models.Model):
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)
    shipping_address = models.OneToOneField(ShippingAddress, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

# -----------------------
# Admin Model
# -----------------------
class Admin(models.Model):
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"
