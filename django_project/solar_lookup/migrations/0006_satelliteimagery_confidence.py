# Generated by Django 3.2 on 2021-05-14 01:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('solar_lookup', '0005_auto_20210514_0108'),
    ]

    operations = [
        migrations.AddField(
            model_name='satelliteimagery',
            name='confidence',
            field=models.FloatField(default=0),
        ),
    ]