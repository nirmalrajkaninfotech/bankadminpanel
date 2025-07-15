import api from './api';
import { BeforeHeaderData } from '@/types';

export const getBeforeHeader = async (): Promise<BeforeHeaderData> => {
  const response = await api.get('/before-header');
  return {
    logo: response.data.logo,
    logoAlt: {
      ta: response.data.logoAltTamil,
      en: response.data.logoAltEnglish,
    },
    title: {
      ta: response.data.titleTamil,
      en: response.data.titleEnglish,
    },
    subtitle: {
      ta: response.data.subtitleTamil,
      en: response.data.subtitleEnglish,
    },
    yearsImage: response.data.yearsImage,
    yearsImageAlt: response.data.yearsImageAlt,
    contacts: response.data.contacts,
  };
};

export const updateBeforeHeader = async (data: BeforeHeaderData): Promise<void> => {
  const formData = new FormData();
  
  // Append non-file fields
  formData.append('_id', data._id || '');
  formData.append('logoAltTamil', data.logo.altTamil);
  formData.append('logoAltEnglish', data.logo.altEnglish);
  formData.append('titleTamil', data.title.tamil);
  formData.append('titleEnglish', data.title.english);
  formData.append('subtitleTamil', data.subtitle.tamil);
  formData.append('subtitleEnglish', data.subtitle.english);
  formData.append('yearsImageAlt', data.yearsImage.alt);
  
  // Append files if they are File objects, otherwise append the string URL
  if (data.logo.src instanceof File) {
    formData.append('logo', data.logo.src);
  } else {
    formData.append('logoSrc', data.logo.src);
  }
  
  if (data.yearsImage.src instanceof File) {
    formData.append('yearsImage', data.yearsImage.src);
  } else {
    formData.append('yearsImageSrc', data.yearsImage.src);
  }
  
  // Append contacts as JSON
  formData.append('contacts', JSON.stringify(data.contacts));
  
  await api.put('/before-header', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};
