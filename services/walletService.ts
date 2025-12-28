
import { storageService } from './storageService';
import { TransactionPayload } from '../types';

/**
 * Nelo Wallet Service
 * Implements cryptographic signing and double-spending prevention
 */
export const walletService = {
  /**
   * Generates a signed transaction payload for offline verification.
   * Monotonic counter prevents replay attacks (double-spending).
   */
  signTransaction: async (amount: number): Promise<TransactionPayload> => {
    const counter = storageService.incrementCounter();
    const payload: TransactionPayload = {
      id: `tx_${Math.random().toString(36).substr(2, 9)}`,
      amount,
      timestamp: Date.now(),
      monotonicCounter: counter,
      currency: 'EUR'
    };

    // Simulation of Elliptic Curve Digital Signature (ECDSA) via Secure Enclave
    // In a real app: const signature = await Keychain.signPayload(keyId, payload);
    const mockSignature = `sig_64_${btoa(JSON.stringify(payload)).substr(0, 32)}`;
    
    return {
      ...payload,
      signature: mockSignature
    };
  },

  getBalance: (): number => {
    return storageService.get<number>('balance') ?? 1250.50;
  },

  updateBalance: (newBalance: number): void => {
    storageService.set('balance', newBalance);
  }
};
