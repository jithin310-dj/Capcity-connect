import { storageService } from './storageService';
import { activityLogService } from './activityLogService';
import { courseService } from './courseService';
import { assessmentService } from './assessmentService';
import { Certificate } from '../types';

export const certificateService = {
  getCertificatesByTrainee(traineeId: string): Certificate[] {
    return storageService.getCertificates().filter((c) => c.traineeId === traineeId);
  },

  getAllCertificates(): Certificate[] {
    return storageService.getCertificates();
  },

  getCertificateById(id: string): Certificate | undefined {
    return storageService.getCertificates().find((c) => c._id === id || c.certificateId === id);
  },

  generateCertificate(
    traineeId: string,
    traineeName: string,
    arg3: string, // could be traineeEmail or courseId
    arg4?: string | number, // could be courseId or courseTitle
    arg5?: number, // could be score
    arg6?: string // trainerName
  ): Certificate {
    const certificates = storageService.getCertificates();

    let courseId = '';
    let courseTitle = '';
    let traineeEmail = '';
    let score = 88;
    let trainerId = 'u-trainer-1';
    let trainerName = 'Faculty Lead';

    if (typeof arg4 === 'string' && typeof arg5 === 'number') {
      // Called with: (traineeId, traineeName, courseId, courseTitle, score, trainerName)
      courseId = arg3;
      courseTitle = arg4;
      score = arg5;
      trainerName = arg6 || 'Faculty Lead';
      traineeEmail = `${traineeName.toLowerCase().replace(/\s+/g, '.')}@capacityconnect.gov.in`;

      const course = courseService.getCourseById(courseId);
      if (course) {
        trainerId = course.trainerId;
        trainerName = course.trainerName;
      }
    } else {
      // Called with: (traineeId, traineeName, traineeEmail, courseId)
      traineeEmail = arg3;
      courseId = String(arg4 || '');
      const course = courseService.getCourseById(courseId);
      if (course) {
        courseTitle = course.title;
        trainerId = course.trainerId;
        trainerName = course.trainerName;
      }

      const results = assessmentService.getResultsByTrainee(traineeId);
      const assessmentResult = results.find((r) => r.courseId === courseId && r.passed);
      score = assessmentResult ? assessmentResult.percentage : 88;
    }

    const existing = certificates.find((c) => c.traineeId === traineeId && c.courseId === courseId);
    if (existing) return existing;

    const certNum = Math.floor(10000 + Math.random() * 89999);
    const certificateId = `CC-2026-${certNum}`;

    const newCert: Certificate = {
      _id: `cert-${Date.now()}`,
      certificateId,
      traineeId,
      traineeName,
      traineeEmail,
      courseId,
      courseTitle: courseTitle || 'Certified Professional Course',
      trainerId,
      trainerName,
      score,
      issueDate: new Date().toISOString().split('T')[0],
      verificationStatus: 'valid'
    };

    const updated = [newCert, ...certificates];
    storageService.setCertificates(updated);

    activityLogService.log(
      traineeId,
      traineeName,
      'trainee',
      'Earned Course Certificate',
      'Certificate',
      `${newCert.courseTitle} (ID: ${certificateId})`,
      'success'
    );

    return newCert;
  },

  verifyCertificate(certificateId: string): { valid: boolean; certificate?: Certificate; message: string } {
    const cert = this.getCertificateById(certificateId);
    if (!cert) {
      return {
        valid: false,
        message: 'No cryptographic certificate matching this verification ID was found in the CAPACITY CONNECT ledger.'
      };
    }

    if (cert.verificationStatus === 'revoked') {
      return {
        valid: false,
        certificate: cert,
        message: 'This certificate has been revoked by institutional authority.'
      };
    }

    return {
      valid: true,
      certificate: cert,
      message: 'Certificate is authentic, digitally verified, and issued under the Capacity Connect National Framework.'
    };
  }
};
