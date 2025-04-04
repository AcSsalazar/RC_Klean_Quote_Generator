from rest_framework.permissions import BasePermission, IsAuthenticated
from django.conf import settings

class IsAuthorizedClient(BasePermission):
    def has_permission(self, request, view):
        client_token = request.headers.get('X-Client-Token') or request.headers.get('x-client-token')
        return client_token == settings.CLIENT_TOKEN

class IsAuthorizedClientOrAuthenticated(BasePermission):
    def has_permission(self, request, view):
        if IsAuthorizedClient().has_permission(request, view):
            return True
        
        return IsAuthenticated().has_permission(request, view)