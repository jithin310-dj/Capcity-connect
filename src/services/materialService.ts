import { storageService } from './storageService';
import { activityLogService } from './activityLogService';
import { Material } from '../types';

export const materialService = {
  getMaterials(courseId?: string): Material[] {
    const materials = storageService.getMaterials();
    if (courseId) {
      return materials.filter((m) => m.courseId === courseId);
    }
    return materials;
  },

  getMaterialsByTrainer(trainerId: string): Material[] {
    return storageService.getMaterials().filter((m) => m.trainerId === trainerId);
  },

  uploadMaterial(
    trainerIdOrData: string | Partial<Material>,
    trainerName?: string,
    data?: Partial<Material>
  ): Material {
    let trainerId = 'u-trainer-1';
    let tName = 'Trainer';
    let materialData: Partial<Material> = {};

    if (typeof trainerIdOrData === 'object') {
      materialData = trainerIdOrData;
      trainerId = materialData.trainerId || 'u-trainer-1';
      tName = materialData.trainerName || 'Trainer';
    } else {
      trainerId = trainerIdOrData;
      tName = trainerName || 'Trainer';
      materialData = data || {};
    }

    const materials = storageService.getMaterials();
    const newMaterial: Material = {
      _id: `mat-${Date.now()}`,
      title: materialData.title || 'Untitled Learning Resource',
      courseId: materialData.courseId || '',
      courseTitle: materialData.courseTitle || 'General Knowledge Repository',
      trainerId,
      trainerName: tName,
      subject: materialData.subject || 'General',
      moduleTitle: materialData.moduleTitle || 'Supplementary Resource',
      skill: materialData.skill || 'General',
      fileType: materialData.fileType || 'pdf',
      fileUrl: materialData.fileUrl || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/sample.pdf',
      fileSize: materialData.fileSize || '2.5 MB',
      downloadsCount: 0,
      createdAt: new Date().toISOString()
    };

    const updated = [newMaterial, ...materials];
    storageService.setMaterials(updated);

    activityLogService.log(
      trainerId,
      tName,
      'trainer',
      'Uploaded Learning Resource',
      'Trainer Library',
      newMaterial.title,
      'success'
    );

    return newMaterial;
  },

  deleteMaterial(
    trainerIdOrMatId: string,
    trainerName?: string,
    materialId?: string
  ): void {
    let matId = trainerIdOrMatId;
    let trainerId = 'u-trainer-1';
    let tName = 'Trainer';

    if (materialId) {
      trainerId = trainerIdOrMatId;
      tName = trainerName || 'Trainer';
      matId = materialId;
    }

    const materials = storageService.getMaterials();
    const target = materials.find((m) => m._id === matId);
    if (!target) return;

    const filtered = materials.filter((m) => m._id !== matId);
    storageService.setMaterials(filtered);

    activityLogService.log(
      trainerId,
      tName,
      'trainer',
      'Deleted Learning Resource',
      'Trainer Library',
      target.title,
      'warning'
    );
  },

  updateMaterial(materialId: string, updates: Partial<Material>): Material | null {
    const materials = storageService.getMaterials();
    const idx = materials.findIndex((m) => m._id === materialId);
    if (idx === -1) return null;
    const updated = { ...materials[idx], ...updates };
    materials[idx] = updated;
    storageService.setMaterials(materials);
    return updated;
  }
};
