from django.contrib import admin
from .models import *
# Register your models here.

admin.site.register(User)
admin.site.register(Email)
admin.site.register(TeamsChatMessage)
admin.site.register(TeamsChat)
admin.site.register(TeamsDirectMessage)
admin.site.register(Meeting)
admin.site.register(Customer)
admin.site.register(PartnerCompany)
