# Generated by Django 3.2.3 on 2021-05-17 02:44

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('system_builder', '0002_auto_20210517_0236'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='arraymodel',
            name='auto_increment_id',
        ),
        migrations.AddField(
            model_name='arraymodel',
            name='id',
            field=models.BigAutoField(auto_created=True, default=django.utils.timezone.now, primary_key=True, serialize=False, verbose_name='ID'),
            preserve_default=False,
        ),
    ]
