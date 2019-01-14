import { ORM } from 'redux-orm';
import Models from './models';

const orm = new ORM();
orm.register(...Models);

export default orm;
