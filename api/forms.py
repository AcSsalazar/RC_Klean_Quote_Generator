from django import forms
from .models import QuantityOption

class QuantityOptionForm(forms.ModelForm):
    class Meta:
        model = QuantityOption
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.instance and self.instance.option_type:
            # Actualizar dinámicamente las opciones de option_value
            choices_map = {
                'burner': QuantityOption.BURNER_CHOICES,
                'grill_size': QuantityOption.GRILL_CHOICES,
                'hood': QuantityOption.HOOD_CHOICES,
            }
            self.fields['option_value'].choices = choices_map.get(self.instance.option_type, [])
