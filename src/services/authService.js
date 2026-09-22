import { supabase } from '../supabaseClient';
import { officerService } from './officerService';
import { notificationService } from './notificationService';

const CURRENT_USER_KEY = 'swachhata_current_user';

export const authService = {
  // Default Admin credentials
  ADMIN_EMAIL: 'admin@gmail.com',
  ADMIN_PASSWORD: 'Admin@123',

  getCurrentUser() {
    try {
      const stored = localStorage.getItem(CURRENT_USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },

  async login(email, password) {
    const cleanEmail = email.trim().toLowerCase();

    // 1. Check if default Admin
    if (cleanEmail === this.ADMIN_EMAIL.toLowerCase()) {
      if (password === this.ADMIN_PASSWORD) {
        const adminUser = {
          id: 'admin_root',
          email: this.ADMIN_EMAIL,
          name: 'Admin',
          role: 'admin',
          municipality_type: 'State Administration',
          municipality_name: 'ગાંધીનગર (મુખ્ય કાર્યાલય)'
        };
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(adminUser));
        window.dispatchEvent(new CustomEvent('swachhata_auth_changed'));
        return { success: true, user: adminUser };
      } else {
        throw new Error('અમાન્ય પાસવર્ડ! કૃપા કરીને સાચો પાસવર્ડ દાખલ કરો.');
      }
    }

    // 2. Check if Officer
    const officer = await officerService.getOfficerByEmail(cleanEmail);
    if (officer) {
      if (officer.password_hash === password) {
        const officerUser = {
          id: officer.id,
          email: officer.email,
          name: officer.name,
          mobile: officer.mobile,
          role: 'officer',
          municipality_type: officer.municipality_type,
          municipality_name: officer.municipality_name
        };
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(officerUser));
        window.dispatchEvent(new CustomEvent('swachhata_auth_changed'));
        return { success: true, user: officerUser };
      } else {
        throw new Error('અમાન્ય પાસવર્ડ! કૃપા કરીને તમારો પાસવર્ડ તપાસો અથવા Forgot Password નો ઉપયોગ કરો.');
      }
    }

    throw new Error('આ ઇમેઇલ સાથે કોઈ એકાઉન્ટ મળ્યું નથી.');
  },

  async changePassword(currentPassword, newPassword) {
    const user = this.getCurrentUser();
    if (!user) throw new Error('તમે લૉગ ઇન થયેલા નથી.');

    if (user.role === 'admin') {
      if (currentPassword !== this.ADMIN_PASSWORD) {
        throw new Error('હાલનો એડમિન પાસવર્ડ અમાન્ય છે.');
      }
      this.ADMIN_PASSWORD = newPassword;
      return { success: true, message: 'એડમિન પાસવર્ડ સફળતાપૂર્વક બદલાયો છે.' };
    }

    // Officer password update
    const officer = await officerService.getOfficerByEmail(user.email);
    if (!officer) throw new Error('અધિકારી એકાઉન્ટ મળ્યું નથી.');

    if (officer.password_hash !== currentPassword) {
      throw new Error('હાલનો પાસવર્ડ અમાન્ય છે.');
    }

    await officerService.updateOfficerPassword(officer.id, newPassword);

    notificationService.addNotification({
      type: 'security',
      title: 'પાસવર્ડ બદલાયો (Password Changed)',
      recipient: user.email,
      body: `નમસ્તે ${user.name}, તમારો પાસવર્ડ સફળતાપૂર્વક અપડેટ થયો છે. નવો પાસવર્ડ: ${newPassword}`
    });

    return { success: true, message: 'પાસવર્ડ સફળતાપૂર્વક બદલાઈ ગયો છે.' };
  },

  async requestPasswordReset(email) {
    const cleanEmail = email.trim().toLowerCase();
    
    if (cleanEmail === this.ADMIN_EMAIL.toLowerCase()) {
      notificationService.addNotification({
        type: 'password_reset',
        title: 'એડમિન પાસવર્ડ રીસેટ (Admin Password Reset)',
        recipient: cleanEmail,
        body: `ડિફૉલ્ટ એડમિન લૉગિન: ઈમેલ: ${this.ADMIN_EMAIL}, પાસવર્ડ: ${this.ADMIN_PASSWORD}`
      });
      return { success: true, message: 'પાસવર્ડ માહિતી સિસ્ટમ નોટિફિકેશન / ઇમેલમાં મોકલવામાં આવી છે.' };
    }

    const officer = await officerService.getOfficerByEmail(cleanEmail);
    if (!officer) {
      throw new Error('આ ઇમેઇલ સાથે કોઈ નોંધાયેલ અધિકારી મળ્યા નથી.');
    }

    // Generate temporary password
    const tempPassword = 'Temp@' + Math.floor(1000 + Math.random() * 9000);
    await officerService.updateOfficerPassword(officer.id, tempPassword);

    notificationService.addNotification({
      type: 'password_reset',
      title: 'પાસવર્ડ રીસેટ સૂચના (Officer Password Reset)',
      recipient: cleanEmail,
      body: `નમસ્તે ${officer.name},\nતમારો ટેમ્પરરી પાસવર્ડ છે: ${tempPassword}\nકૃપા કરીને આ પાસવર્ડ વડે લૉગ ઇન કરો અને તમારી પ્રોફાઇલમાંથી નવો પાસવર્ડ સેટ કરો.`
    });

    return {
      success: true,
      message: `પાસવર્ડ રીસેટ લિંક અને નવો પાસવર્ડ (${cleanEmail}) પર મોકલવામાં આવ્યો છે. (નોટિફિકેશન બોક્સ તપાસો)`
    };
  },

  logout() {
    localStorage.removeItem(CURRENT_USER_KEY);
    window.dispatchEvent(new CustomEvent('swachhata_auth_changed'));
  }
};
