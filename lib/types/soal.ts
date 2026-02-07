export interface Question {
  no: number
  answer: string
  question: string
}

export interface Section {
  category: string
  questions: Question[]
}

export interface SoalJson {
  title: string
  sections: Section[]
  source_document: string
  total_questions: number
}

export interface SoalData {
  code_name: string
  json_file: SoalJson
}

export interface SessionSoal {
  session: string
  code_name: string
  current_soal: SoalJson
  current_number: number
  created_at?: string
}
