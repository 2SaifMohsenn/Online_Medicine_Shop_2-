from django.contrib import admin
from .models import Medicine, Order, OrderItem, User, Admin

# -------------------
# Medicine Admin
# -------------------
@admin.register(Medicine)
class MedicineAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'price', 'stock', 'is_available', 'created_at')
    search_fields = ('name', 'category')
    list_filter = ('category', 'is_available')
    list_editable = ('price', 'stock', 'is_available')

# -------------------
# Order Admin
# -------------------
@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'total_price', 'is_paid', 'created_at')
    list_filter = ('is_paid', 'created_at')
    search_fields = ('user__first_name', 'user__last_name')

# -------------------
# OrderItem Admin
# -------------------
@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ('order', 'medicine', 'quantity', 'price')
    search_fields = ('medicine__name',)

# -------------------
# User Admin
# -------------------
@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'email', 'shipping_address')
    search_fields = ('first_name', 'last_name', 'email')
    list_filter = ('shipping_address',)

# -------------------
# Admin Admin
# -------------------
@admin.register(Admin)
class AdminAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'email')
    search_fields = ('first_name', 'last_name', 'email')


