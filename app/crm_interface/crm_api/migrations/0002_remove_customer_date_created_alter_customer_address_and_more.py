# Generated by Django 5.0.2 on 2024-03-31 19:59

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("crm_api", "0001_initial"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="customer",
            name="date_created",
        ),
        migrations.AlterField(
            model_name="customer",
            name="address",
            field=models.TextField(null=True),
        ),
        migrations.AlterField(
            model_name="customer",
            name="phone",
            field=models.CharField(max_length=15, null=True),
        ),
        migrations.CreateModel(
            name="PartnerCompany",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("name", models.CharField(max_length=255)),
                ("email", models.EmailField(max_length=255, null=True)),
                ("phone", models.CharField(max_length=15, null=True)),
                ("address", models.TextField(null=True)),
                ("customers", models.ManyToManyField(to="crm_api.customer")),
            ],
        ),
    ]