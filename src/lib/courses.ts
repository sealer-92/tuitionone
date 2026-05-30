export interface Course {
  id: string
  subject: string
  title: string
  year: string
  day: string
  time: string
  weeks: number
  price: number
  status: 'open' | 'filling' | 'waitlist'
  spots?: number
  featured?: boolean
}

export const COURSES: Course[] = [
  { id: 'om-5',  subject: 'Maths',     title: 'Ordinary Level Maths',     year: '5th Year',    day: 'Saturday', time: '09:00–10:00', weeks: 14, price: 450, status: 'open' },
  { id: 'om-6',  subject: 'Maths',     title: 'Ordinary Level Maths',     year: '6th Year',    day: 'Saturday', time: '10:00–11:00', weeks: 14, price: 450, status: 'filling', spots: 3 },
  { id: 'hc-6',  subject: 'Chemistry', title: 'Higher Level Chemistry',   year: '6th Year',    day: 'Saturday', time: '11:00–12:00', weeks: 14, price: 450, status: 'filling', spots: 2 },
  { id: 'jcm',   subject: 'Maths',     title: 'Higher Level Maths',       year: 'Junior Cert', day: 'Saturday', time: '12:00–13:00', weeks: 14, price: 450, status: 'open' },
  { id: 'hm-5',  subject: 'Maths',     title: 'Higher Level Maths',       year: '5th Year',    day: 'Saturday', time: '13:00–14:00', weeks: 20, price: 550, status: 'open', featured: true },
  { id: 'hm-6',  subject: 'Maths',     title: 'Higher Level Maths',       year: '6th Year',    day: 'Saturday', time: '14:00–15:00', weeks: 20, price: 550, status: 'filling', spots: 4 },
  { id: 'oc-6',  subject: 'Chemistry', title: 'Ordinary Level Chemistry', year: '6th Year',    day: 'Saturday', time: '15:00–16:00', weeks: 14, price: 450, status: 'waitlist' },
  { id: 'jcs',   subject: 'Science',   title: 'Junior Cycle Science',     year: 'Junior Cert', day: 'Saturday', time: '08:00–09:00', weeks: 14, price: 450, status: 'open' },
]
