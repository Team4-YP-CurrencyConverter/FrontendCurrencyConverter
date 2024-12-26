import './index.css';
import mainInitialization from './render/mainInitialization.ts';
import CURRENCYOBJECTIDS from './utils/constants/currencyObjectIds.ts';
import handleAddButton from './utils/handlers/addbutton.ts';
import handleToggleButton from './utils/handlers/closeinputbutton.ts';
import handleConverionInput from './utils/handlers/conversionInput.ts';
import handleSearchCurrency from './utils/handlers/searchcurrency.ts';
import handleSelectButton from './utils/handlers/selectbutton.ts';

handleSelectButton();
handleAddButton();
handleToggleButton();

await mainInitialization();

handleSearchCurrency();

CURRENCYOBJECTIDS.forEach((id) => handleConverionInput(id));
