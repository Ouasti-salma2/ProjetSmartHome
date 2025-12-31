
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { DevicesService, Device } from '../../services/devices.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  user: any = null;
  devices: Device[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';

  showCreateForm: boolean = false;
  newDevice = {
    name: '',
    type: 'Light',
    location: ''
  };

  constructor(
    private authService: AuthService,
    private devicesService: DevicesService,
    private router: Router
  ) {}

  ngOnInit() {
    this.user = this.authService.getCurrentUser();
    if (!this.user) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadDevices();
  }

  loadDevices() {
    this.isLoading = true;
    this.errorMessage = '';

    this.devicesService.getDevices().subscribe({
      next: (devices) => {
        this.devices = devices;
        this.isLoading = false;
        console.log('Devices chargés:', devices);
      },
      error: (error) => {
        console.error('Erreur:', error);
        this.errorMessage = 'Impossible de charger les équipements';
        this.isLoading = false;
      }
    });
  }

  toggleDevice(device: Device) {
    this.devicesService.toggleDevice(device.id).subscribe({
      next: (updatedDevice) => {
        const index = this.devices.findIndex(d => d.id === device.id);
        if (index !== -1) {
          this.devices[index] = updatedDevice;
        }
      },
      error: (error) => {
        console.error('Erreur toggle:', error);
        this.errorMessage = 'Impossible de changer l\'état';
      }
    });
  }

  createDevice() {
    if (!this.newDevice.name || !this.newDevice.location) {
      this.errorMessage = 'Veuillez remplir tous les champs';
      return;
    }

    this.devicesService.createDevice(this.newDevice).subscribe({
      next: (device) => {
        this.devices.push(device);
        this.newDevice = { name: '', type: 'Light', location: '' };
        this.showCreateForm = false;
        this.errorMessage = '';
      },
      error: (error) => {
        console.error('Erreur création:', error);
        this.errorMessage = 'Impossible de créer l\'équipement';
      }
    });
  }

  deleteDevice(deviceId: number) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet équipement ?')) {
      return;
    }

    this.devicesService.deleteDevice(deviceId).subscribe({
      next: () => {
        this.devices = this.devices.filter(d => d.id !== deviceId);
      },
      error: (error) => {
        console.error('Erreur suppression:', error);
        this.errorMessage = 'Impossible de supprimer';
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
