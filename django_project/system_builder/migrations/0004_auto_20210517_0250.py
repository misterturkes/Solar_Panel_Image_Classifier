# Generated by Django 3.2.3 on 2021-05-17 02:50

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('system_builder', '0003_auto_20210517_0244'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='arraymodel',
            name='created',
        ),
        migrations.RemoveField(
            model_name='arraymodel',
            name='username',
        ),
    ]
