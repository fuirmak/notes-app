import React, { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";

const Notes = () => {
  const [user] = useAuthState(auth);
  const [notes, setNotes] = useState([]);
  const [noteInput, setNoteInput] = useState("");
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editNoteInput, setEditNoteInput] = useState("");

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "notes"),
      where("uid", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNotes(notesData);
    });

    return () => unsubscribe();
  }, [user]);

  const handleAddOrUpdateNote = async () => {
    if (!noteInput.trim()) return;
    if (!user) return;

    if (editingNoteId) {
      await updateDoc(doc(db, "notes", editingNoteId), {
        text: noteInput,
      });
      setEditingNoteId(null);
    } else {
      await addDoc(collection(db, "notes"), {
        text: noteInput,
        uid: user.uid,
        createdAt: serverTimestamp(),
      });
    }

    setNoteInput("");
  };

  const handleDeleteNote = async (id) => {
    await deleteDoc(doc(db, "notes", id));
  };

  const handleEditNote = (note) => {
    setEditingNoteId(note.id);
    setEditNoteInput(note.text);
  };

  const handleSaveEdit = async (id) => {
    if (!editNoteInput.trim()) return;
    await updateDoc(doc(db, "notes", id), {
      text: editNoteInput,
    });
    setEditingNoteId(null);
    setEditNoteInput("");
  };

  const handleLogout = () => {
    signOut(auth).catch((error) => console.error("Logout failed:", error));
  };

  return (
    <div className="h-screen w-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="w-[600px] h-[90vh] bg-gray-950 rounded-lg shadow-lg p-6 flex flex-col">
        <div className="mb-4">
          <h1 className="text-4xl font-bold mb-4">📝 My Notes</h1>
          <button
            onClick={handleLogout}
            className="mb-4 px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
          >
            ↩ Logout
          </button>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Write a note..."
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
              className="flex-1 px-4 py-2 text-black rounded"
            />
            <button
              onClick={handleAddOrUpdateNote}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {editingNoteId ? "Update" : "Add"}
            </button>
          </div>
        </div>

        {/* Scrollable Notes Section */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-2">
          {notes.map((note) => (
            <div
              key={note.id}
              className="flex justify-between items-center bg-gray-800 p-3 rounded"
            >
              {editingNoteId === note.id ? (
                <input
                  type="text"
                  value={editNoteInput}
                  onChange={(e) => setEditNoteInput(e.target.value)}
                  className="flex-1 px-2 py-1 text-black rounded"
                />
              ) : (
                <span>{note.text}</span>
              )}

              <div className="flex gap-2 ml-4">
                {editingNoteId === note.id ? (
                  <button
                    onClick={() => handleSaveEdit(note.id)}
                    className="text-green-400 hover:text-green-600"
                  >
                    💾
                  </button>
                ) : (
                  <button
                    onClick={() => handleEditNote(note)}
                    className="text-yellow-400 hover:text-yellow-600"
                  >
                    ✏️
                  </button>
                )}
                <button
                  onClick={() => handleDeleteNote(note.id)}
                  className="text-red-400 hover:text-red-600"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Notes;
