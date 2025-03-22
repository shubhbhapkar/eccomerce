from rest_framework.permissions import BasePermission

class IsVendor(BasePermission):
    
    def has_permission(self, request, view):
        # Check if the user is authenticated and is a vendor
        if request.user.is_authenticated and getattr(request.user, 'is_vendor', False):
            return True
        return False
