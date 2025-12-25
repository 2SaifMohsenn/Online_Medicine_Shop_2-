from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    MedicineViewSet, UserViewSet, AdminViewSet, OrderViewSet, OrderItemViewSet,
    signup, login, update_user_profile, update_admin_profile, change_password,
    get_dashboard_stats, create_order
)

router = DefaultRouter()
router.register('medicines', MedicineViewSet)
router.register('users', UserViewSet)
router.register('admins', AdminViewSet)
router.register('orders', OrderViewSet)
router.register('order-items', OrderItemViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/signup/', signup, name='signup'),
    path('api/login/', login, name='login'),
    path('api/update-user-profile/', update_user_profile, name='update_user_profile'),
    path('api/update-admin-profile/', update_admin_profile, name='update_admin_profile'),
    path('api/change-password/', change_password, name='change_password'),
    path('api/dashboard-stats/', get_dashboard_stats, name='dashboard_stats'),
    path('api/create-order/', create_order, name='create_order'),
]

