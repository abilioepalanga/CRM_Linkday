# Generated by Django 5.0.2 on 2024-04-24 19:17

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("crm_api", "0006_task"),
    ]

    operations = [
        migrations.AddField(
            model_name="task",
            name="spent_time",
            field=models.IntegerField(null=True),
        ),
    ]