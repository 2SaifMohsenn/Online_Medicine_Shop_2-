from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MedicineViewSet, UserViewSet, AdminViewSet, OrderViewSet, OrderItemViewSet

router = DefaultRouter()
router.register('medicines', MedicineViewSet)
router.register('users', UserViewSet)
router.register('admins', AdminViewSet)
router.register('orders', OrderViewSet)
router.register('order-items', OrderItemViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
]
