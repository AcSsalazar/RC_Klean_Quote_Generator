from django.contrib import admin
from .models import ClientQuestionnaire 

from django.contrib import admin
from .models import (
    ClientQuestionnaire, ServiceType, FacilityType, AreaSize, 
    CleaningFreq, ToiletsQty, StartDateOption, HiringLikelihood )

@admin.register(ClientQuestionnaire)
class ClientQuestionnaireAdmin(admin.ModelAdmin):
    list_display = ('service_type', 'created_at')
    list_filter = ('service_type', 'created_at')
    search_fields = ('user__email',)

admin.site.register(ServiceType)
admin.site.register(FacilityType)
admin.site.register(AreaSize)
admin.site.register(CleaningFreq)
admin.site.register(ToiletsQty)
admin.site.register(StartDateOption)
admin.site.register(HiringLikelihood)