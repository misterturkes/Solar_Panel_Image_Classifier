# Generated by Django 3.2 on 2021-05-11 18:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('solar_lookup', '0003_alter_satelliteimagery_photo'),
    ]

    operations = [
        migrations.AlterField(
            model_name='satelliteimagery',
            name='photo',
            field=models.ImageField(upload_to='upload'),
        ),
    ]
