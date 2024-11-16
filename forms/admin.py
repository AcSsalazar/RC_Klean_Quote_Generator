from django.contrib import admin
from .models import ClientQuestionnaire 

from django.contrib import admin
from .models import (
    ClientQuestionnaire, ServiceType, FacilityType, AreaSize, 
    CleaningFreq, ToiletsQty, StartDateOption, HiringLikelihood )
from django.contrib import admin
from .models import ClientQuestionnaire

@admin.register(ClientQuestionnaire)
class ClientQuestionnaireAdmin(admin.ModelAdmin):
    # Mostrar el campo 'user_display' en lugar del campo 'user'
    list_display = ['get_user_display', 'service_type', 'facility_type', 'created_at']

    # Método que devuelve 'Anonymous_0X' o el email del usuario
    def get_user_display(self, obj):
        if obj.user:
            return obj.user.email  # Muestra el email si el usuario está registrado
        return f"Anonymous_{obj.id:02}"  # Muestra "Anonymous_0X" si el usuario es anónimo
    
    get_user_display.short_description = 'User'  # Cambia el nombre de la columna a "User"


admin.site.register(ServiceType)
admin.site.register(FacilityType)
admin.site.register(AreaSize)
admin.site.register(CleaningFreq)
admin.site.register(ToiletsQty)
admin.site.register(StartDateOption)
admin.site.register(HiringLikelihood)