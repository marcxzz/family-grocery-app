'use client'

import { Plus, ShoppingCart, Edit3, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { CreateList, DeleteList, UpdateList } from '@/data/lists'
import NewListForm from './NewListForm'
import EditListForm from './EditListForm'

export default function ListsOverview({ lists: listsParam, supermarkets }) {
  const [lists, setLists] = useState(listsParam ?? [])
  const [showNewListForm, setShowNewListForm] = useState(false)
  const [editingList, setEditingList] = useState(null)
  // TODO: add state to disable buttons during db operations
  
  const router = useRouter()

  const createList = async (name, supermarketId) => {
    const res = await CreateList(name, parseInt(supermarketId))
    if (res) {
      const newList = res[0]
      setLists([...lists, newList])
      setShowNewListForm(false)
    }
  }

  const updateList = async (listId, name, supermarketId) => {
    const res = await UpdateList(listId, name, supermarketId)
    if (res) {
      const updatedList = res[0]
      const updatedLists = lists.map(list =>
        list.id === listId ? {...list, name: updatedList.name, supermarketId: updatedList.supermarketId} : list
      )
      setLists(updatedLists)
      setEditingList(null)
    }
  }

  const deleteList = async (listId) => {
    const res = await DeleteList(listId)
    if (res) {
      const updatedLists = lists.filter(list => list.id !== listId)
      setLists(updatedLists)
    }
  }

  const getSupermarketName = (supermarketId) => {
    return supermarkets.find(market => (market.id == supermarketId))?.name
  }

  return (
    <div>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className={`text-xl font-semibold text-white dark:text-gray-900`}>Le Tue Liste</h2>
          <button onClick={() => setShowNewListForm(true)} className="button button-primary button-icon">
            <Plus className="size-5" />
            Nuova Lista
          </button>
        </div>

        {lists.length === 0 ? (
          <div className={`text-center py-12 text-gray-400 dark:text-gray-500`}>
            <ShoppingCart className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg mb-2">Nessuna lista creata</p>
            <p>Crea la tua prima lista della spesa!</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {lists.map(list => (
              <div key={list.id} className='list-card' onClick={() => router.push(`/${list.id}?name=${list.name}${list.supermarketId ? `&supermarket=${getSupermarketName(list.supermarketId)}` : ''}`)}>
                <div className="flex items-start justify-between mb-3 grow-1">
                  <div className="flex-1">
                    <h3 className={`font-semibold text-white dark:text-gray-900 mb-1`}>
                      {list.name}
                    </h3>
                    <p className={`text-sm text-gray-400 dark:text-gray-600`}>
                      {getSupermarketName(list.supermarketId)}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setEditingList(list)
                      }}
                      className={`p-2 rounded-lg text-gray-400 hover:bg-gray-700 dark:text-gray-500 dark:hover:bg-gray-100`}
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    {(!parseInt(list.totalProducts) > 0) && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteList(list.id)
                        }}
                        className={`p-2 rounded-lg text-red-400 hover:bg-gray-700 dark:text-red-500 dark:hover:bg-red-50`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-1 ">
                  <p className={`text-sm text-gray-400 dark:text-gray-600`}>
                    {list.totalProducts ?? 0} prodotti
                  </p>
                  <p className={`text-sm text-gray-400 dark:text-gray-600`}>
                    {list.purchasedProducts ?? 0} acquistati
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {showNewListForm && (
        <NewListForm
          supermarkets={supermarkets}
          createList={createList}
          setShowNewListForm={setShowNewListForm}
        />
      )}

      {editingList && (
        <EditListForm
          list={editingList}
          supermarkets={supermarkets}
          updateList={updateList}
          setEditingList={setEditingList}
        />
      )}

      {/* TODO: add list deletion dialog if there is at least one product linked (on cascade delete) */}
    </div>
  )
}
