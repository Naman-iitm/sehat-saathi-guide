import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  getMedicalHistory,
  saveMedicalHistory,
  MedicalHistory,
} from '@/lib/medicalHistoryStorage';

type Mode = 'view' | 'add' | 'upload';

const emptyForm: MedicalHistory = {
  bloodGroup: '',
  allergies: '',
  chronicConditions: '',
  surgeries: '',
  medications: '',
};

const MedicalHistoryPage: React.FC = () => {
  const [form, setForm] = useState<MedicalHistory>(emptyForm);
  const [mode, setMode] = useState<Mode>('add');

  useEffect(() => {
    const data = getMedicalHistory();
    if (data) {
      setForm(data);
      setMode('view');
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    saveMedicalHistory(form);
    setMode('view');
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      <Card className="bg-background/80 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            🧾 Medical History
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Mode Switch */}
          <div className="flex rounded-lg bg-secondary p-1">
            <button
              onClick={() => setMode('add')}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition ${
                mode === 'add'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground'
              }`}
            >
              Add Details
            </button>
            <button
              onClick={() => setMode('upload')}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition ${
                mode === 'upload'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground'
              }`}
            >
              Upload Report
            </button>
          </div>

          {/* VIEW MODE */}
          {mode === 'view' && (
            <div className="space-y-3 text-sm">
              <p><b>Blood Group:</b> {form.bloodGroup || '—'}</p>
              <p><b>Allergies:</b> {form.allergies || '—'}</p>
              <p><b>Chronic Conditions:</b> {form.chronicConditions || '—'}</p>
              <p><b>Surgeries / Illnesses:</b> {form.surgeries || '—'}</p>
              <p><b>Medications:</b> {form.medications || '—'}</p>

              <Button
                variant="secondary"
                className="w-full mt-4"
                onClick={() => setMode('add')}
              >
                Edit Details
              </Button>
            </div>
          )}

          {/* ADD DETAILS MODE */}
          {mode === 'add' && (
            <>
              <select
                value={form.bloodGroup}
                onChange={(e) =>
                  setForm({ ...form, bloodGroup: e.target.value })
                }
                className="w-full p-3 rounded-md bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select Blood Group</option>
                <option>A+</option>
                <option>A-</option>
                <option>B+</option>
                <option>B-</option>
                <option>AB+</option>
                <option>AB-</option>
                <option>O+</option>
                <option>O-</option>
              </select>

              <Input
                name="allergies"
                placeholder="Allergies"
                value={form.allergies}
                onChange={handleChange}
              />
              <Input
                name="chronicConditions"
                placeholder="Chronic Conditions"
                value={form.chronicConditions}
                onChange={handleChange}
              />
              <Input
                name="surgeries"
                placeholder="Past Surgeries / Major Illnesses"
                value={form.surgeries}
                onChange={handleChange}
              />
              <Input
                name="medications"
                placeholder="Ongoing Medications"
                value={form.medications}
                onChange={handleChange}
              />

              <Button onClick={handleSave} className="w-full">
                Save Medical History
              </Button>
            </>
          )}

          {/* UPLOAD MODE */}
          {mode === 'upload' && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Upload medical reports (PDF / Image).  
                Files stay on your device.
              </p>

              <label className="flex items-center justify-center w-full h-32 border border-dashed border-border rounded-lg cursor-pointer hover:bg-secondary/40 transition">
                <span className="text-sm text-muted-foreground">
                  Click to upload or drag & drop
                </span>
                <input
                  type="file"
                  accept=".pdf,image/*"
                  className="hidden"
                />
              </label>

              <p className="text-xs text-muted-foreground">
                Upload is for reference only. No data is sent to any server.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MedicalHistoryPage;
