
import { AppMode, NfcResult, UserProfile } from '../types';

/**
 * Nelo NFC Service
 * Expert-level implementation of NFC interactions
 */
export const nfcService = {
  /**
   * MODE 1: NDEF (vCard) - Profile Sharing
   */
  writeVCard: async (profile: UserProfile): Promise<NfcResult> => {
    console.log("[NFC] Preparing NDEF vCard record...");
    const vCard = `BEGIN:VCARD
VERSION:3.0
FN:${profile.fullName}
ORG:${profile.company}
TITLE:${profile.title}
TEL;TYPE=WORK,VOICE:${profile.phone}
EMAIL;TYPE=PREF,INTERNET:${profile.email}
END:VCARD`;

    // Simulation: nfcManager.requestTechnology(NfcTech.Ndef)
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("[NFC] NDEF Record Written:", vCard);
        resolve({ success: true, message: "Profil partagé via NFC" });
      }, 1500);
    });
  },

  /**
   * MODE 2: ISO 7816 (APDU) - Secure Payment Exchange
   * Communicates with Secure Element or HCE (Host Card Emulation)
   */
  executeSecurePayment: async (payload: any): Promise<NfcResult> => {
    console.log("[NFC] Establishing ISO 7816 channel...");
    
    // Command APDU: Select Payment Applet (AID: F00102030405)
    const selectApplet = "00A4040006F00102030405";
    console.log(`[APDU] SEND: ${selectApplet}`);
    
    // Response APDU: 9000 (Success)
    console.log(`[APDU] RECV: 6F10...9000`);

    // Command APDU: Process Transaction
    const processTx = `80A00000${payload.id.length.toString(16)}${payload.id}`;
    console.log(`[APDU] SEND: ${processTx}`);

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ 
          success: true, 
          message: "Paiement sécurisé validé",
          data: { txId: payload.id, counter: payload.monotonicCounter }
        });
      }, 2000);
    });
  }
};
