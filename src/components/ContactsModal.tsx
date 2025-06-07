import React, { useState, useEffect } from 'react';
import { XIcon, PlusIcon, EditIcon, SaveIcon, TrashIcon, UserIcon } from 'lucide-react';
import { fetchContactsByOrganization, insertContact, updateContact, deleteContact, Contact, ContactInsert } from '../services/contactService';

interface ContactsModalProps {
  organizationCode: string;
  organizationName: string;
  onClose: () => void;
}

interface EditingContact extends Contact {
  isEditing?: boolean;
  isNew?: boolean;
}

export const ContactsModal: React.FC<ContactsModalProps> = ({
  organizationCode,
  organizationName,
  onClose
}) => {
  const [contacts, setContacts] = useState<EditingContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadContacts();
  }, [organizationCode]);

  const loadContacts = async () => {
    try {
      setLoading(true);
      const data = await fetchContactsByOrganization(organizationCode);
      setContacts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load contacts');
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    const newContact: EditingContact = {
      id: `new-${Date.now()}`,
      first_name: '',
      last_name: '',
      provider_npi: null,
      organization_code: organizationCode,
      organization_name: organizationName,
      location_code: '',
      created_at: null,
      updated_at: null,
      isEditing: true,
      isNew: true
    };
    setContacts([newContact, ...contacts]);
  };

  const handleEdit = (contactId: string) => {
    setContacts(contacts.map(contact => 
      contact.id === contactId 
        ? { ...contact, isEditing: true }
        : { ...contact, isEditing: false }
    ));
  };

  const handleCancel = (contactId: string) => {
    if (contacts.find(contact => contact.id === contactId)?.isNew) {
      // Remove new contact if cancelled
      setContacts(contacts.filter(contact => contact.id !== contactId));
    } else {
      // Reset editing state
      setContacts(contacts.map(contact => 
        contact.id === contactId 
          ? { ...contact, isEditing: false }
          : contact
      ));
    }
  };

  const handleSave = async (contactId: string) => {
    const contact = contacts.find(c => c.id === contactId);
    if (!contact) return;

    // Validate required fields
    if (!contact.first_name.trim() || !contact.last_name.trim() || !contact.location_code.trim()) {
      setError('First name, last name, and location code are required');
      return;
    }

    try {
      setSaving(contactId);
      setError(null);

      if (contact.isNew) {
        // Create new contact
        const contactData: ContactInsert = {
          first_name: contact.first_name.trim(),
          last_name: contact.last_name.trim(),
          provider_npi: contact.provider_npi?.trim() || null,
          organization_code: organizationCode,
          organization_name: organizationName,
          location_code: contact.location_code.trim()
        };

        const newContact = await insertContact(contactData);
        
        // Replace the temporary contact with the real one
        setContacts(contacts.map(c => 
          c.id === contactId 
            ? { ...newContact, isEditing: false }
            : c
        ));
      } else {
        // Update existing contact
        const updates = {
          first_name: contact.first_name.trim(),
          last_name: contact.last_name.trim(),
          provider_npi: contact.provider_npi?.trim() || null,
          organization_name: organizationName,
          location_code: contact.location_code.trim()
        };

        const updatedContact = await updateContact(contact.id, updates);
        
        setContacts(contacts.map(c => 
          c.id === contactId 
            ? { ...updatedContact, isEditing: false }
            : c
        ));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save contact');
    } finally {
      setSaving(null);
    }
  };

  const handleDelete = async (contactId: string) => {
    if (!confirm('Are you sure you want to delete this contact?')) return;

    try {
      setSaving(contactId);
      await deleteContact(contactId);
      setContacts(contacts.filter(contact => contact.id !== contactId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete contact');
    } finally {
      setSaving(null);
    }
  };

  const handleFieldChange = (contactId: string, field: keyof Contact, value: string) => {
    setContacts(contacts.map(contact => 
      contact.id === contactId 
        ? { ...contact, [field]: value }
        : contact
    ));
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-4 mx-auto p-5 border w-11/12 max-w-5xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <UserIcon className="h-6 w-6 text-blue-600 mr-2" />
            <div>
              <h3 className="text-lg font-medium text-gray-900">Contacts</h3>
              <p className="text-sm text-gray-500">{organizationName}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleAddNew}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700"
            >
              <PlusIcon className="h-4 w-4" />
              <span>Add Contact</span>
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XIcon className="h-6 w-6" />
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    First Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Provider NPI
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location Code
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {contacts.map((contact) => (
                  <tr key={contact.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      {contact.isEditing ? (
                        <input
                          type="text"
                          value={contact.first_name}
                          onChange={(e) => handleFieldChange(contact.id, 'first_name', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="First name"
                          required
                        />
                      ) : (
                        <span className="text-sm font-medium text-gray-900">
                          {contact.first_name}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {contact.isEditing ? (
                        <input
                          type="text"
                          value={contact.last_name}
                          onChange={(e) => handleFieldChange(contact.id, 'last_name', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Last name"
                          required
                        />
                      ) : (
                        <span className="text-sm text-gray-900">
                          {contact.last_name}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {contact.isEditing ? (
                        <input
                          type="text"
                          value={contact.provider_npi || ''}
                          onChange={(e) => handleFieldChange(contact.id, 'provider_npi', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Provider NPI"
                        />
                      ) : (
                        <span className="text-sm text-gray-900">
                          {contact.provider_npi || '-'}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {contact.isEditing ? (
                        <input
                          type="text"
                          value={contact.location_code}
                          onChange={(e) => handleFieldChange(contact.id, 'location_code', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Location code"
                          required
                        />
                      ) : (
                        <span className="text-sm text-gray-900">
                          {contact.location_code}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        {contact.isEditing ? (
                          <>
                            <button
                              onClick={() => handleSave(contact.id)}
                              disabled={saving === contact.id}
                              className="bg-green-600 text-white p-1 rounded hover:bg-green-700 disabled:opacity-50"
                              title="Save"
                            >
                              <SaveIcon className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleCancel(contact.id)}
                              disabled={saving === contact.id}
                              className="bg-gray-100 text-gray-700 p-1 rounded hover:bg-gray-200 disabled:opacity-50"
                              title="Cancel"
                            >
                              <XIcon className="h-4 w-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleEdit(contact.id)}
                              className="bg-blue-600 text-white p-1 rounded hover:bg-blue-700"
                              title="Edit"
                            >
                              <EditIcon className="h-4 w-4" />
                            </button>
                            {!contact.isNew && (
                              <button
                                onClick={() => handleDelete(contact.id)}
                                disabled={saving === contact.id}
                                className="bg-red-100 text-red-700 p-1 rounded hover:bg-red-200 disabled:opacity-50"
                                title="Delete"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {contacts.length === 0 && (
              <div className="text-center py-12">
                <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No contacts found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by adding a new contact.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};