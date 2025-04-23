import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Edit, Trash2, Check, X, Upload, Image } from 'lucide-react';
import { Assistant } from '../../types';

export const AssistantSettings: React.FC = () => {
  const { state, createAssistant, updateAssistant, deleteAssistant } = useApp();
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<Omit<Assistant, 'id' | 'createdAt' | 'updatedAt'>>({
    name: '',
    description: '',
    systemPrompt: '',
    avatar: '',
  });
  
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      systemPrompt: '',
      avatar: '',
    });
    setPreviewImage(null);
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPreviewImage(base64String);
        setFormData(prev => ({ ...prev, avatar: base64String }));
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      const assistant = state.assistants.find(a => a.id === editingId);
      if (assistant) {
        updateAssistant({
          ...assistant,
          ...formData,
        });
      }
      setEditingId(null);
    } else {
      createAssistant(formData);
      setIsCreating(false);
    }
    
    resetForm();
  };
  
  const handleEdit = (assistant: Assistant) => {
    setFormData({
      name: assistant.name,
      description: assistant.description,
      systemPrompt: assistant.systemPrompt,
      avatar: assistant.avatar,
    });
    setPreviewImage(assistant.avatar);
    setEditingId(assistant.id);
    setIsCreating(false);
  };
  
  const handleDelete = (assistantId: string) => {
    setShowDeleteConfirm(assistantId);
  };
  
  const confirmDelete = (assistantId: string) => {
    deleteAssistant(assistantId);
    setShowDeleteConfirm(null);
  };
  
  const handleCancel = () => {
    setIsCreating(false);
    setEditingId(null);
    resetForm();
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Assistentes Personalizados
        </h2>
        
        {!isCreating && !editingId && (
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-1 py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Assistente</span>
          </button>
        )}
      </div>
      
      {(isCreating || editingId) && (
        <form onSubmit={handleSubmit} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nome do Assistente
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="ex: Especialista em Culinária"
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Descrição
              </label>
              <input
                type="text"
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="Um assistente que fornece dicas de culinária"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Avatar do Assistente
              </label>
              <div className="mt-1 flex items-center space-x-4">
                <div className="relative">
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Avatar preview"
                      className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <Image className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <Upload className="w-4 h-4" />
                  Upload Imagem
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Recomendado: JPG, PNG. Máximo 1MB.
              </p>
            </div>
            
            <div>
              <label htmlFor="systemPrompt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Prompt do Sistema
              </label>
              <div className="mt-1">
                <textarea
                  id="systemPrompt"
                  rows={5}
                  value={formData.systemPrompt}
                  onChange={(e) => setFormData({ ...formData, systemPrompt: e.target.value })}
                  required
                  className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Você é um assistente especializado em culinária. Você fornece receitas precisas, dicas de cozinha e responde perguntas sobre preparação de alimentos."
                />
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Este prompt define como o assistente deve se comportar e qual conhecimento ele deve ter.
                </p>
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={handleCancel}
                className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {editingId ? 'Atualizar Assistente' : 'Criar Assistente'}
              </button>
            </div>
          </div>
        </form>
      )}
      
      <div className="mt-6">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
          Seus Assistentes
        </h3>
        
        <ul className="space-y-2">
          {state.assistants.map((assistant) => (
            <li 
              key={assistant.id}
              className={`p-3 rounded-lg border ${
                editingId === assistant.id
                  ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <div className="flex items-start gap-4">
                {assistant.avatar ? (
                  <img
                    src={assistant.avatar}
                    alt={`${assistant.name} avatar`}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <Image className="w-6 h-6 text-gray-400" />
                  </div>
                )}
                
                <div className="flex-1">
                  <div className="flex justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {assistant.name}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {assistant.description}
                      </p>
                    </div>
                    
                    <div className="flex items-start space-x-2">
                      <button
                        onClick={() => handleEdit(assistant)}
                        className="p-1 rounded text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                        title="Editar assistente"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      
                      {showDeleteConfirm === assistant.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => confirmDelete(assistant.id)}
                            className="p-1 rounded text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30"
                            title="Confirmar exclusão"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(null)}
                            className="p-1 rounded text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                            title="Cancelar exclusão"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleDelete(assistant.id)}
                          className="p-1 rounded text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                          title="Excluir assistente"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                    <div className="line-clamp-2">
                      <span className="font-medium">Prompt do sistema: </span>
                      {assistant.systemPrompt}
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};