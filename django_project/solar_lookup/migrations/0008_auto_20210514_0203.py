# Generated by Django 3.2 on 2021-05-14 02:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('solar_lookup', '0007_auto_20210514_0148'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='satelliteimagery',
            name='lat',
        ),
        migrations.RemoveField(
            model_name='satelliteimagery',
            name='lng',
        ),
        migrations.AddField(
            model_name='satelliteimagery',
            name='address',
            field=models.TextField(default=''),
        ),
    ]