import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConditionService } from '../../services/condition.service';
import { RegleService } from '../../services/regle.service';
import { Condition, Regle } from '../../Models/models';

@Component({
  selector: 'app-condition-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './condition-form.component.html',
  styleUrls: ['./condition-form.component.css']
})
export class ConditionFormComponent implements OnInit, OnDestroy {

  idEquipement = 0;
  nomEquipement = '';
  typeEquipement = '';

  isOnOff = false;
  isNombre = false;
  valeurOnOff = 'ON';
  valeurNombre = 20;
  minTemp = 16;
  maxTemp = 30;
  historique: Condition[] = [];
  loadingCondition = false;
  loadingHistorique = false;
  successCondition = '';
  errorCondition = '';

  dateRegle: string | null = new Date().toISOString().split('T')[0];
  heureDebut = '08:00';
  heureFin = '22:00';
  regles: Regle[] = [];
  loadingRegle = false;
  loadingRegles = false;
  successRegle = '';
  errorRegle = '';

  chaqueJour = false;

  jours = [
    { label: 'Lun', value: 'lundi',    checked: false },
    { label: 'Mar', value: 'mardi',    checked: false },
    { label: 'Mer', value: 'mercredi', checked: false },
    { label: 'Jeu', value: 'jeudi',    checked: false },
    { label: 'Ven', value: 'vendredi', checked: false },
    { label: 'Sam', value: 'samedi',   checked: false },
    { label: 'Dim', value: 'dimanche', checked: false },
  ];

  currentTime = '';
  currentDate = '';
  private timer: any;

  activeTab: 'condition' | 'regle' = 'condition';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private conditionService: ConditionService,
    private regleService: RegleService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const rawId = String(params['id'] ?? '').replace(/\D.*/, '');
      this.idEquipement = parseInt(rawId, 10);
      this.nomEquipement = params['nom'] || '';
      this.typeEquipement = params['type'] || '';
      this.detectType();
      this.loadHistorique();
      this.loadRegles();
    });
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
    this.currentTime = now.toLocaleTimeString('fr-FR', {
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
    this.currentDate = now.toLocaleDateString('fr-FR', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
  }

  detectType(): void {
    const t = this.typeEquipement.toLowerCase();
    this.isOnOff  = t === 'lampe' || t === 'television';
    this.isNombre = t === 'clime' || t === 'chauffage';
    if (t === 'chauffage') { this.minTemp = 10; this.maxTemp = 35; this.valeurNombre = 18; }
    if (t === 'clime')     { this.minTemp = 16; this.maxTemp = 30; this.valeurNombre = 22; }
  }

  // ===== CONDITIONS =====
  loadHistorique(): void {
    if (!this.idEquipement) return;
    this.loadingHistorique = true;
    this.conditionService.getByEquipement(this.idEquipement).subscribe({
      next: (data) => { this.historique = data; this.loadingHistorique = false; },
      error: ()     => { this.loadingHistorique = false; }
    });
  }

  getValeur(): string {
    if (this.isOnOff)  return this.valeurOnOff;
    if (this.isNombre) return this.valeurNombre.toString();
    return '';
  }

  submitCondition(): void {
    const valeur = this.getValeur();
    if (!valeur) { this.errorCondition = 'Veuillez saisir une valeur'; return; }
    this.loadingCondition = true;
    this.successCondition = '';
    this.errorCondition   = '';
    this.conditionService.create({
      idEquipement:  this.idEquipement,
      nomEquipement: this.nomEquipement,
      valeur:        valeur,
      dateHeure:     new Date().toISOString()
    }).subscribe({
      next: () => {
        this.successCondition = `✅ Condition "${valeur}" appliquée avec succès !`;
        this.loadingCondition = false;
        this.loadHistorique();
      },
      error: () => {
        this.errorCondition  = 'Erreur lors de l\'application de la condition';
        this.loadingCondition = false;
      }
    });
  }

  deleteCondition(id: number): void {
    this.conditionService.delete(id).subscribe({
      next:  () => this.loadHistorique(),
      error: () => this.errorCondition = 'Erreur lors de la suppression'
    });
  }

  // ===== RÈGLES =====
  loadRegles(): void {
    if (!this.idEquipement) return;
    this.loadingRegles = true;
    this.regleService.getByEquipement(this.idEquipement).subscribe({
      next: (data) => { this.regles = data; this.loadingRegles = false; },
      error: ()     => { this.loadingRegles = false; }
    });
  }

  onChaqueJourChange(): void {
    this.dateRegle = this.chaqueJour ? null : new Date().toISOString().split('T')[0];
  }

  getJoursSelectionnes(): string {
    if (this.chaqueJour) return this.jours.map(j => j.value).join(',');
    return this.jours.filter(j => j.checked).map(j => j.value).join(',');
  }

  toggleTousLesJours(): void {
    const tousCoches = this.jours.every(j => j.checked);
    this.jours.forEach(j => j.checked = !tousCoches);
    this.chaqueJour = !tousCoches;
  }

  tousLesJoursCoches(): boolean {
    return this.jours.every(j => j.checked);
  }

  onJourChange(): void {
    this.chaqueJour = this.jours.every(j => j.checked);
  }

  submitRegle(): void {
    if (!this.heureDebut || !this.heureFin) {
      this.errorRegle = 'Veuillez remplir tous les champs'; return;
    }
    if (!this.chaqueJour && !this.dateRegle) {
      this.errorRegle = 'Veuillez sélectionner une date'; return;
    }

    this.loadingRegle = true;
    this.successRegle = '';
    this.errorRegle   = '';

    this.regleService.create({
      dateRegle:    this.chaqueJour ? null : this.dateRegle, // ✅ null au lieu de 'chaque_jour'
      heureDebut:   this.heureDebut,
      heureFin:     this.heureFin,
      idEquipement: this.idEquipement,
      jours:        this.getJoursSelectionnes(),
      chaqueJour:   this.chaqueJour
    }).subscribe({
      next: () => {
        this.successRegle = this.chaqueJour
          ? `✅ Règle répétée chaque jour de ${this.heureDebut} à ${this.heureFin} !`
          : `✅ Règle planifiée le ${this.dateRegle} de ${this.heureDebut} à ${this.heureFin} !`;
        this.loadingRegle = false;
        this.chaqueJour = false;
        this.dateRegle = new Date().toISOString().split('T')[0];
        this.jours.forEach(j => j.checked = false);
        this.loadRegles();
      },
      error: () => {
        this.errorRegle  = 'Erreur lors de la création de la règle';
        this.loadingRegle = false;
      }
    });
  }

  deleteRegle(id: number): void {
    this.regleService.delete(id).subscribe({
      next:  () => this.loadRegles(),
      error: () => this.errorRegle = 'Erreur lors de la suppression'
    });
  }

  formatJours(jours: string): string {
    if (!jours) return '';
    return jours.split(',')
      .map(j => j.charAt(0).toUpperCase() + j.slice(1, 3))
      .join(' · ');
  }

  getIcon(): string {
    const t = this.typeEquipement.toLowerCase();
    if (t === 'lampe')      return '💡';
    if (t === 'clime')      return '❄️';
    if (t === 'chauffage')  return '🔥';
    if (t === 'television') return '📺';
    return '🔌';
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleString('fr-FR');
  }

  formatDateShort(dateStr: string | null): string {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('fr-FR');
  }

  goBack(): void {
    this.router.navigate(['/smarthouse']);
  }
}