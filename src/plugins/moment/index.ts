import { appModule } from '@/store/app';
import moment from 'moment';
import './extendMoment';

moment.locale(appModule.selectedLanguage);
