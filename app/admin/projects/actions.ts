'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addProject(formData: FormData) {
  const supabase = createClient()
  
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const category = formData.get('category') as string
  const technologies = (formData.get('technologies') as string).split(',').map(t => t.trim())
  const demo_link = formData.get('demo_link') as string
  const repo_link = formData.get('repo_link') as string
  const is_active = formData.get('is_active') === 'on'
  
  // Handle Image Upload
  const imageFile = formData.get('thumbnail') as File
  let image_url = null

  if (imageFile && imageFile.size > 0) {
    const fileExt = imageFile.name.split('.').pop()
    const fileName = `${Math.random()}.${fileExt}`
    const filePath = `thumbnails/${fileName}`

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('project-images')
      .upload(filePath, imageFile)

    if (uploadError) {
      console.error('Upload error:', uploadError)
      throw new Error(`Failed to upload image: ${uploadError.message}`)
    }

    // Get Public URL
    const { data: { publicUrl } } = supabase.storage
      .from('project-images')
      .getPublicUrl(filePath)
    
    image_url = publicUrl
  }

  const { error } = await supabase.from('projects').insert([{
    title,
    description,
    category,
    technologies,
    image_url,
    demo_link,
    repo_link,
    is_active
  }])

  if (error) throw new Error(error.message)

  revalidatePath('/admin/projects')
  revalidatePath('/projects')
  revalidatePath('/')
}

export async function deleteProject(id: string) {
  const supabase = createClient()
  const { error } = await supabase.from('projects').delete().eq('id', id)
  
  if (error) throw new Error(error.message)

  revalidatePath('/admin/projects')
  revalidatePath('/')
}

export async function toggleProjectActive(id: string, currentStatus: boolean) {
  const supabase = createClient()
  const { error } = await supabase
    .from('projects')
    .update({ is_active: !currentStatus })
    .eq('id', id)

  if (error) throw new Error(error.message)

  revalidatePath('/admin/projects')
  revalidatePath('/')
}
