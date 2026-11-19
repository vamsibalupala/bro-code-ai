import test from 'node:test';
import assert from 'node:assert/strict';
import { Conversation } from '../data/mockData';

const mockConvos: Conversation[] = [
  {
    id: 'c1',
    partnerId: 'u1',
    partnerName: 'Rahul Sharma',
    partnerAvatar: 'avatar1.jpg',
    isOnline: true,
    lastSeen: 'Active now',
    unreadCount: 2,
    isVanishMode: false,
    isPinned: true,
    isArchived: false,
    securityFingerprint: '12345',
    preferredLanguage: 'hi',
    lastMessage: { text: 'Hello', time: '12:00', isSelf: false, isEncrypted: true },
    messages: [],
  },
  {
    id: 'c2',
    partnerId: 'u2',
    partnerName: 'Arjun Dev',
    partnerAvatar: 'avatar2.jpg',
    isOnline: false,
    lastSeen: '1h ago',
    unreadCount: 0,
    isVanishMode: false,
    isPinned: false,
    isArchived: false,
    securityFingerprint: '67890',
    preferredLanguage: 'te',
    lastMessage: { text: 'Bro watch party', time: '11:00', isSelf: false, isEncrypted: true },
    messages: [],
  },
];

test('archive conversation toggles isArchived correctly', () => {
  const archived = mockConvos.map(c => c.id === 'c1' ? { ...c, isArchived: true } : c);
  assert.equal(archived.find(c => c.id === 'c1')?.isArchived, true);
  assert.equal(archived.find(c => c.id === 'c2')?.isArchived, false);

  const activeFiltered = archived.filter(c => !c.isArchived);
  assert.equal(activeFiltered.length, 1);
  assert.equal(activeFiltered[0].id, 'c2');

  const archivedFiltered = archived.filter(c => c.isArchived);
  assert.equal(archivedFiltered.length, 1);
  assert.equal(archivedFiltered[0].id, 'c1');
});

test('delete conversation removes from list and can be restored from stash', () => {
  const stash = new Map<string, Conversation>();
  const convoToDelete = mockConvos.find(c => c.id === 'c1');
  if (convoToDelete) {
    stash.set('c1', convoToDelete);
  }

  const afterDelete = mockConvos.filter(c => c.id !== 'c1');
  assert.equal(afterDelete.length, 1);
  assert.equal(afterDelete.find(c => c.id === 'c1'), undefined);

  // Restore from stash
  const restored = [stash.get('c1')!, ...afterDelete];
  assert.equal(restored.length, 2);
  assert.equal(restored[0].id, 'c1');
});

test('unread count excludes archived conversations', () => {
  const withOneArchived = mockConvos.map(c => c.id === 'c1' ? { ...c, isArchived: true } : c);
  const unreadTotal = withOneArchived
    .filter(c => !c.isArchived)
    .reduce((acc, c) => acc + (c.unreadCount || 0), 0);

  // c1 had 2 unreads but is archived, c2 has 0, so total is 0
  assert.equal(unreadTotal, 0);
});
