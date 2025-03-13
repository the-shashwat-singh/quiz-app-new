-- Create quiz_results table
CREATE TABLE IF NOT EXISTS quiz_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_reg_no TEXT NOT NULL,
  student_name TEXT NOT NULL,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  time_taken INTEGER NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  quiz_type TEXT NOT NULL,
  answers JSONB NOT NULL
);

-- Enable Row Level Security
ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access to quiz results"
  ON quiz_results FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert access to quiz results"
  ON quiz_results FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow admin delete access to quiz results"
  ON quiz_results FOR DELETE
  TO authenticated
  USING (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_quiz_results_student_reg_no ON quiz_results(student_reg_no);
CREATE INDEX IF NOT EXISTS idx_quiz_results_timestamp ON quiz_results(timestamp);
CREATE INDEX IF NOT EXISTS idx_quiz_results_score ON quiz_results(score);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE quiz_results; 