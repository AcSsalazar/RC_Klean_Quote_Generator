from django.db import models
from userauths.models import User

class ServiceType(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name

class FacilityType(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name

class AreaSize(models.Model):
    description = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.description

class CleaningFreq(models.Model):
    description = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.description

class ToiletsQty(models.Model):
    description = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.description

class StartDateOption(models.Model):
    description = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.description

class HiringLikelihood(models.Model):
    description = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.description


class ClientQuestionnaire(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='questionnaires', null=True, blank=True)
    service_type = models.ForeignKey(ServiceType, on_delete=models.SET_NULL, null=True, blank=True)
    facility_type = models.ForeignKey(FacilityType, on_delete=models.SET_NULL, null=True, blank=True)
    area_size = models.ForeignKey(AreaSize, on_delete=models.SET_NULL, null=True, blank=True)
    cleaning_frequency = models.ForeignKey(CleaningFreq, on_delete=models.SET_NULL, null=True, blank=True)
    toilets_number = models.ForeignKey(ToiletsQty, on_delete=models.SET_NULL, null=True, blank=True)
    start_date = models.ForeignKey(StartDateOption, on_delete=models.SET_NULL, null=True, blank=True)
    hiring_likelihood = models.ForeignKey(HiringLikelihood, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Questionnaire by {self.user.email} on {self.created_at.strftime('%Y-%m-%d')}"


