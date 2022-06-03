import { writable, get as g } from 'svelte/store';
import { Robaac } from './robaac';
import { useStore } from './store';
const authsStore = useStore('auth');

class Zession {
  constructor() {
    if (!Zession.instance) {
      this.store = writable(null);
      this.subscriptions = [];
      this.rbac = Robaac([]);
      Zession.instance = this;
    }

    return Zession.instance;
  }

  set(k, v, evt) {
    this.store.update((s) => ({ ...(s || {}), [k]: v }));
  }

  unset(k, evt) {
    const val = g(this.store);
    if (val) {
      delete val[k];
      this.store.set(val);
    }
  }
  patch(data) {
    this.store.update((s) => ({ ...(s || {}), ...data }));
    const store = g(this.store);
    this.rbac = Robaac(store ? store.cans || [] : []);
  }

  subscribe(fn) {
    return this.store.subscribe(fn);
  }

  get(k) {
    const store = g(this.store);
    return store ? (k ? store[k] : store) : null;
  }

  reset(currentUser) {
    this.store.set(currentUser);
    this.rbac = Robaac(currentUser ? currentUser.cans || [] : [], { id: (currentUser || {}).id });
  }

  can(action, param) {
    if (!this.isAuthenticated()) return this.logout();
    return this.rbac.can(`manage_*`, param) || this.rbac.can(action, param);
  }

  isAuthenticated() {
    const data = this.get();
    return !!data && !!data.id;
  }

  login(user) {
    if (!user) return this.reset(null);
    this.reset(user);

    const { id } = user,
      userStore = useStore('users', { id });
    userStore.sync(user);

    const userSub = userStore.subscribe(({ data: _users }) => {
      // console.log('Session changed : ', _users);

      const nuser = _users.find((u) => u.id === user.id);

      if (!nuser) return;
      const { status } = nuser;
      // return console.log('Nu user: ', nuser);
      const { role } = this.get();
      if (nuser.role !== role || status === 'Inactive') {
        return this.logout();
      }

      this.patch(nuser);
    });

    this.subscriptions.push(userSub);
  }

  beginTrack() {
    // console.log('Tracking session...');
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    let timer;
    const wait = 5,
      get_out = async () => {
        clearTimeout(timer);
        this.logout();
      },
      resetTimer = () => {
        // console.log('Resetting tracking...');
        clearTimeout(timer);
        timer = setTimeout(get_out, 60000 * wait);
      };
    document.onkeydown = resetTimer;
    document.onmousemove = resetTimer;
    window.onscroll = resetTimer;
    timer = setTimeout(get_out, 60000 * wait);
  }

  async logout() {
    this.subscriptions.forEach((s) => s());
    await authsStore.signOut();
    if (process.browser) {
      sessionStorage.clear();
    }
    this.reset(null);
  }
}
const zession = new Zession(),
  logout = zession.logout.bind(zession),
  login = zession.login.bind(zession),
  can = zession.can.bind(zession),
  beginTrack = zession.beginTrack.bind(zession),
  isAuthed = zession.isAuthenticated.bind(zession),
  subscribe = zession.subscribe.bind(zession),
  principal = zession.get.bind(zession),
  update = zession.patch.bind(zession),
  set = zession.set.bind(zession);

export { login, logout, can, beginTrack, isAuthed, principal, subscribe, set, update };
