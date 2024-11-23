from .models import QuantityOption
from django import forms

class QuantityOptionsForm(forms.ModelForm):
    class Meta:
        model = QuantityOption
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        if self.instance and self.instance.option_type:
            # Ajustar las opciones de `option_value` dinámicamente
            if self.instance.option_type == 'burner':
                self.fields['option_value'].widget = forms.Select(choices=QuantityOption.BURNER_CHOICES)
            elif self.instance.option_type == 'grill_size':
                self.fields['option_value'].widget = forms.Select(choices=QuantityOption.GRILL_CHOICES)
            elif self.instance.option_type == 'hood':
                self.fields['option_value'].widget = forms.Select(choices=QuantityOption.HOOD_CHOICES)