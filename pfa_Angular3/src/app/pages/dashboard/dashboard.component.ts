import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EquipementService } from '../../services/equipement.service';
import { Equipement } from '../../Models/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  equipements: Equipement[] = [];
  groupedByPiece: { [key: string]: Equipement[] } = {};
  pieceNames: string[] = [];
  currentTime: string = '';
  currentDate: string = '';
  loading = true;
  error = '';
  private timer: any;

  constructor(private equipementService: EquipementService, private router: Router) {}

  ngOnInit(): void {
    this.loadEquipements();
    this.startClock();
  }

  ngOnDestroy(): void {
    if (this.timer) clearInterval(this.timer);
  }

  startClock(): void {
    this.updateTime();
    this.timer = setInterval(() => this.updateTime(), 1000);
  }

  updateTime(): void {
    const now = new Date();
    this.currentTime = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    this.currentDate = now.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }

  loadEquipements(): void {
    this.loading = true;
    this.error = '';
    this.equipementService.getAll().subscribe({
      next: (data) => {
        console.log('Equipements reçus:', JSON.stringify(data)); // debug
        this.equipements = data;
        this.groupByPiece();
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur chargement équipements:', err);
        this.error = 'Erreur de connexion au serveur';
        this.loading = false;
      }
    });
  }

  groupByPiece(): void {
    this.groupedByPiece = {};
    this.equipements.forEach(eq => {
      const key = eq.nomPiece || 'Sans pièce';
      if (!this.groupedByPiece[key]) this.groupedByPiece[key] = [];
      this.groupedByPiece[key].push(eq);
    });
    this.pieceNames = Object.keys(this.groupedByPiece);
  }

  getIcon(type: string): string {
    const t = type?.toLowerCase();
    if (t === 'lampe') return '💡';
    if (t === 'clime') return '❄️';
    if (t === 'chauffage') return '🔥';
    if (t === 'television') return '📺';
    // Si c'est une valeur de la DB (ON/OFF/nombre)
    if (t === 'on' || t === 'off') return '💡';
    if (!isNaN(Number(t))) return Number(t) > 20 ? '❄️' : '🔥';
    return '🔌';
  }

  getTypeLabel(type: string): string {
    const t = type?.toLowerCase();
    if (t === 'lampe') return 'lampe';
    if (t === 'television') return 'television';
    if (t === 'clime') return 'clime';
    if (t === 'chauffage') return 'chauffage';
    // Si c'est une valeur de la DB (ON/OFF/nombre)
    if (t === 'on') return 'lampe';
    if (t === 'off') return 'television';
    if (!isNaN(Number(t))) return Number(t) > 20 ? 'clime' : 'chauffage';
    return type;
  }

  getStatusClass(type: string): string {
    const t = type?.toLowerCase();
    if (t === 'on' || t === 'lampe') return 'status-on';
    if (t === 'off' || t === 'television') return 'status-off';
    if (!isNaN(Number(t)) || t === 'clime' || t === 'chauffage') return 'status-temp';
    return 'status-default';
  }

  goToCondition(eq: Equipement): void {
    // Vérification que l'ID est valide
    const id = Number(eq.id);
    if (!id || isNaN(id) || id <= 0) {
      console.error('ID équipement invalide:', eq);
      return;
    }

    const type = this.getTypeLabel(eq.type);
    console.log(`Navigation condition → id=${id}, nom=${eq.nom}, type=${type}`);

    this.router.navigate(['/condition'], {
      queryParams: {
        id: id,
        nom: eq.nom,
        type: type
      }
    });
  }

  goToRegle(eq: Equipement): void {
    // Vérification que l'ID est valide
    const id = Number(eq.id);
    if (!id || isNaN(id) || id <= 0) {
      console.error('ID équipement invalide:', eq);
      return;
    }

    const type = this.getTypeLabel(eq.type);
    console.log(`Navigation règle → id=${id}, nom=${eq.nom}, type=${type}`);

    this.router.navigate(['/regle'], {
      queryParams: {
        id: id,
        nom: eq.nom,
        type: type
      }
    });
  }
}
