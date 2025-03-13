import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Student, getAllStudents, addStudent as addNewStudent, deleteStudent as removeStudent, applyPenalty, getStudentPenalty, getLocalStorage, setLocalStorage } from '../../models/Students';

export default function StudentManagementPage() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [newStudent, setNewStudent] = useState({ regNumber: '', name: '' });
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [penaltyStudent, setPenaltyStudent] = useState<{ regNumber: string, penalty: number } | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const regNumber = getLocalStorage('regNumber', '');
    if (!regNumber) {
      router.push('/');
      return;
    }
    if (regNumber !== 'RA2411043010075') {
      router.push('/quiz');
      return;
    }
    setIsAdmin(true);
    
    // Load all students
    setStudents(getAllStudents());
  }, [router]);

  const handleAddStudent = () => {
    if (!newStudent.regNumber || !newStudent.name) {
      setError('Please fill in all fields');
      return;
    }

    if (!newStudent.regNumber.match(/^RA\d{13}$/)) {
      setError('Registration number must be in the format RA followed by 13 digits');
      return;
    }

    const success = addNewStudent(newStudent);
    if (!success) {
      setError('A student with this registration number already exists');
      return;
    }

    setStudents(getAllStudents());
    setNewStudent({ regNumber: '', name: '' });
    setError('');
  };

  const handleDeleteStudent = (regNumber: string) => {
    if (regNumber === 'RA2411043010075') {
      setError('Cannot delete admin account');
      return;
    }

    if (confirm('Are you sure you want to delete this student?')) {
      const success = removeStudent(regNumber);
      if (!success) {
        setError('Cannot delete default students');
        return;
      }
      setStudents(getAllStudents());
    }
  };

  const handleEditStudent = (student: Student) => {
    setEditingStudent(student);
    setNewStudent({ regNumber: student.regNumber, name: student.name });
  };

  const handleUpdateStudent = () => {
    if (!editingStudent) return;

    if (!newStudent.name.trim()) {
      setError('Please enter a name');
      return;
    }

    // For default students, store modifications separately
    if (editingStudent.regNumber.match(/^RA241104301007[4-9]|RA241104301008[0-4]$/)) {
      const modifiedStudents = JSON.parse(getLocalStorage('modifiedStudents', '{}'));
      modifiedStudents[editingStudent.regNumber] = newStudent.name;
      setLocalStorage('modifiedStudents', JSON.stringify(modifiedStudents));
    } else {
      // For additional students, update their record directly
      const additionalStudents = JSON.parse(getLocalStorage('additionalStudents', '[]'));
      const updatedStudents = additionalStudents.map((s: Student) =>
        s.regNumber === editingStudent.regNumber ? { ...s, name: newStudent.name } : s
      );
      setLocalStorage('additionalStudents', JSON.stringify(updatedStudents));
    }

    setStudents(getAllStudents());
    setEditingStudent(null);
    setNewStudent({ regNumber: '', name: '' });
    setError('');
  };

  const handleApplyPenalty = () => {
    if (!penaltyStudent) return;

    const success = applyPenalty(penaltyStudent.regNumber, penaltyStudent.penalty);
    if (success) {
      setPenaltyStudent(null);
      setStudents(getAllStudents());
    } else {
      setError('Failed to apply penalty');
    }
  };

  const isDefaultStudent = (regNumber: string) => 
    regNumber.match(/^RA241104301006[2-9]|RA241104301007[0-9]|RA241104301008[0-9]|RA241104301009[0-9]|RA24110430101[0-1][0-9]$/);

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
        <div className="text-2xl font-bold text-gray-700">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Student Management - C++ Quiz</title>
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 py-6">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-xl p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Student Management</h1>

            {/* Add/Edit Student Form */}
            <div className="mb-8 bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {editingStudent ? 'Edit Student' : 'Add New Student'}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Registration Number</label>
                  <input
                    type="text"
                    value={newStudent.regNumber}
                    onChange={(e) => setNewStudent({ ...newStudent, regNumber: e.target.value })}
                    placeholder="RA2411043010XXX"
                    disabled={!!editingStudent}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Student Name</label>
                  <input
                    type="text"
                    value={newStudent.name}
                    onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                    placeholder="Enter student name"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                {error && <p className="text-red-600 text-sm">{error}</p>}
                <div className="flex space-x-4">
                  <button
                    onClick={editingStudent ? handleUpdateStudent : handleAddStudent}
                    className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    {editingStudent ? 'Update Student' : 'Add Student'}
                  </button>
                  {editingStudent && (
                    <button
                      onClick={() => {
                        setEditingStudent(null);
                        setNewStudent({ regNumber: '', name: '' });
                        setError('');
                      }}
                      className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Student List */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Registration Number
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Penalty
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {students.map((student) => (
                    <tr key={student.regNumber}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {student.regNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.regNumber === 'RA2411043010075' ? 'Admin' : 
                         isDefaultStudent(student.regNumber) ? 'Default' : 'Additional'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {penaltyStudent?.regNumber === student.regNumber ? (
                          <div className="flex items-center space-x-2">
                            <input
                              type="number"
                              value={penaltyStudent.penalty}
                              onChange={(e) => setPenaltyStudent({ ...penaltyStudent, penalty: parseInt(e.target.value) })}
                              className="w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                              min="-5"
                              max="0"
                            />
                            <button
                              onClick={handleApplyPenalty}
                              className="text-green-600 hover:text-green-900"
                            >
                              Apply
                            </button>
                            <button
                              onClick={() => setPenaltyStudent(null)}
                              className="text-gray-600 hover:text-gray-900"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <span>{getStudentPenalty(student.regNumber)}</span>
                            <button
                              onClick={() => setPenaltyStudent({ regNumber: student.regNumber, penalty: getStudentPenalty(student.regNumber) })}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Edit
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex space-x-4">
                          {student.regNumber !== 'RA2411043010075' && (
                            <button
                              onClick={() => handleEditStudent(student)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Edit
                            </button>
                          )}
                          {!isDefaultStudent(student.regNumber) && student.regNumber !== 'RA2411043010075' && (
                            <button
                              onClick={() => handleDeleteStudent(student.regNumber)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Navigation */}
            <div className="mt-8 flex justify-end space-x-4">
              <button
                onClick={() => router.push('/admin')}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Back to Admin Panel
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 