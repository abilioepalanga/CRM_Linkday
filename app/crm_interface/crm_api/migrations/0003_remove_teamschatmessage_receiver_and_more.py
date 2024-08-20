# Generated by Django 5.0.2 on 2024-04-01 01:38

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        (
            "crm_api",
            "0002_remove_customer_date_created_alter_customer_address_and_more",
        ),
    ]

    operations = [
        migrations.RemoveField(
            model_name="teamschatmessage",
            name="receiver",
        ),
        migrations.RemoveField(
            model_name="teamschatmessage",
            name="sender",
        ),
        migrations.AlterField(
            model_name="email",
            name="sender",
            field=models.EmailField(max_length=255),
        ),
        migrations.CreateModel(
            name="TeamsChat",
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
                ("members", models.ManyToManyField(to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddField(
            model_name="teamschatmessage",
            name="teams_chat",
            field=models.ForeignKey(
                default=1,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="messages",
                to="crm_api.teamschat",
            ),
            preserve_default=False,
        ),
        migrations.CreateModel(
            name="TeamsDirectMessage",
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
                ("message", models.TextField()),
                ("sender", models.EmailField(max_length=255)),
                ("date_sent", models.DateTimeField(auto_now_add=True)),
                (
                    "receiver",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="teams_direct_message_receiver",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
    ]