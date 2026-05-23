export enum DatabaseType {
  MYSQL = 'mysql',
  POSTGRESQL = 'postgresql',
  ORACLE = 'oracle'
}

export interface Field {
  name: string;
  originalName: string;
  type: string;
  originalType: string;
  isNullable: boolean;
  isPrimaryKey: boolean;
  isAutoIncrement: boolean;
  defaultValue?: string;
  comment?: string;
  length?: number;
  precision?: number;
  scale?: number;
}

export interface ParsedTable {
  tableName: string
  originalTableName: string
  fields: Field[]
  databaseType: DatabaseType
}

const mySqlTypeMap: Record<string, string> = {
  'tinyint': 'Integer',
  'smallint': 'Integer',
  'mediumint': 'Integer',
  'int': 'Integer',
  'integer': 'Integer',
  'bigint': 'Long',
  'float': 'Float',
  'double': 'Double',
  'decimal': 'BigDecimal',
  'numeric': 'BigDecimal',
  'date': 'LocalDate',
  'datetime': 'LocalDateTime',
  'timestamp': 'LocalDateTime',
  'time': 'LocalTime',
  'year': 'Integer',
  'char': 'String',
  'varchar': 'String',
  'tinytext': 'String',
  'text': 'String',
  'mediumtext': 'String',
  'longtext': 'String',
  'binary': 'byte[]',
  'varbinary': 'byte[]',
  'blob': 'byte[]',
  'tinyblob': 'byte[]',
  'mediumblob': 'byte[]',
  'longblob': 'byte[]',
  'json': 'String',
  'enum': 'String',
  'set': 'String',
  'bit': 'Boolean',
  'boolean': 'Boolean',
  'bool': 'Boolean'
};

const postgreSqlTypeMap: Record<string, string> = {
  'smallint': 'Integer',
  'integer': 'Integer',
  'bigint': 'Long',
  'real': 'Float',
  'double': 'Double',
  'double precision': 'Double',
  'numeric': 'BigDecimal',
  'decimal': 'BigDecimal',
  'date': 'LocalDate',
  'time': 'LocalTime',
  'timestamp': 'LocalDateTime',
  'timestamptz': 'OffsetDateTime',
  'char': 'String',
  'character': 'String',
  'varchar': 'String',
  'character varying': 'String',
  'text': 'String',
  'bytea': 'byte[]',
  'boolean': 'Boolean',
  'bool': 'Boolean',
  'json': 'String',
  'jsonb': 'String',
  'uuid': 'UUID',
  'xml': 'String'
};

const oracleTypeMap: Record<string, string> = {
  'number': 'BigDecimal',
  'numeric': 'BigDecimal',
  'decimal': 'BigDecimal',
  'int': 'Integer',
  'integer': 'Integer',
  'smallint': 'Integer',
  'float': 'Double',
  'binary_float': 'Float',
  'binary_double': 'Double',
  'date': 'LocalDateTime',
  'timestamp': 'LocalDateTime',
  'timestamp with time zone': 'OffsetDateTime',
  'char': 'String',
  'character': 'String',
  'varchar2': 'String',
  'nvarchar2': 'String',
  'clob': 'String',
  'nclob': 'String',
  'blob': 'byte[]',
  'raw': 'byte[]',
  'long raw': 'byte[]',
  'boolean': 'Boolean',
  'xmltype': 'String'
};



export function parseSql(sql: string, databaseType: DatabaseType): ParsedTable {
  return parseCreateTable(sql, databaseType);
}

function parseCreateTable(sql: string, databaseType: DatabaseType): ParsedTable {
  const tableName = extractTableName(sql);
  const fields = extractFields(sql, databaseType);
  
  return {
    tableName: toCamelCase(tableName),
    originalTableName: tableName,
    fields,
    databaseType
  };
}

function extractTableName(sql: string): string {
  const match = sql.match(/CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?[`"]?(\w+)[`"]?/i);
  return (match && match[1]) ? match[1] : 'unknown_table';
}

function extractFields(sql: string, databaseType: DatabaseType): Field[] {
  const fields: Field[] = [];
  const contentMatch = sql.match(/\(([\s\S]*)\)/);
  if (!contentMatch) return fields;
  
  const content = contentMatch[1];
  if (!content) return fields;
  
  const statements = content.split(/,(?![^()]*\))/);
  const primaryKeys = extractPrimaryKeys(content);
  
  for (const statement of statements) {
    const trimmed = statement.trim();
    if (trimmed.toUpperCase().startsWith('PRIMARY KEY') || 
        trimmed.toUpperCase().startsWith('KEY ') || 
        trimmed.toUpperCase().startsWith('INDEX ') ||
        trimmed.toUpperCase().startsWith('UNIQUE ') ||
        trimmed.toUpperCase().startsWith('CONSTRAINT ')) {
      continue;
    }
    
    const field = parseFieldDefinition(trimmed, databaseType, primaryKeys);
    if (field) {
      fields.push(field);
    }
  }
  
  return fields;
}

function extractPrimaryKeys(content: string): string[] {
  const match = content.match(/PRIMARY\s+KEY\s*\(([\s\S]*?)\)/i);
  if (!match) return [];
  
  const pkContent = match[1];
  if (!pkContent) return [];
  
  return pkContent
    .split(',')
    .map(k => k.trim().replace(/[`"]/g, ''));
}

function parseFieldDefinition(definition: string, databaseType: DatabaseType, primaryKeys: string[]): Field | null {
  const match = definition.match(/^[`"]?(\w+)[`"]?\s+([\w\s\(\),]+?)(?:\s|,|$)/i);
  if (!match) return null;
  
  const originalName = match[1];
  const typeDefinition = match[2]?.trim() || 'string';
  
  if (!originalName) return null;
  
  const isPrimaryKey = primaryKeys.includes(originalName);
  const isNullable = !/(NOT\s+NULL|NOT\sNULL)/i.test(definition);
  const isAutoIncrement = /AUTO_INCREMENT|SERIAL|GENERATED\s+(?:ALWAYS|BY\s+DEFAULT)\s+AS\s+IDENTITY/i.test(definition);
  
  let comment: string | undefined;
  const commentMatch = definition.match(/COMMENT\s+['"]([^'"]+)['"]/i);
  if (commentMatch) {
    comment = commentMatch[1];
  }
  
  let defaultValue: string | undefined;
  const defaultMatch = definition.match(/DEFAULT\s+['"]?([^'"\s,]+)['"]?/i);
  if (defaultMatch) {
    defaultValue = defaultMatch[1];
  }
  
  const { type, length, precision, scale } = parseType(typeDefinition, databaseType);
  
  return {
    name: toCamelCase(originalName),
    originalName,
    type,
    originalType: typeDefinition,
    isNullable,
    isPrimaryKey,
    isAutoIncrement,
    defaultValue,
    comment,
    length,
    precision,
    scale
  };
}

function parseType(typeDefinition: string, databaseType: DatabaseType) {
  let type = typeDefinition.toLowerCase();
  let length: number | undefined;
  let precision: number | undefined;
  let scale: number | undefined;
  
  const bracketMatch = type.match(/(\w+)\s*\((\d+)(?:,\s*(\d+))?\)/);
  if (bracketMatch) {
    type = bracketMatch[1] || 'string';
    if (bracketMatch[3]) {
      precision = parseInt(bracketMatch[2] || '0');
      scale = parseInt(bracketMatch[3]);
    } else {
      length = parseInt(bracketMatch[2] || '0');
    }
  } else {
    const firstPart = type.split(/\s/)[0];
    type = firstPart || 'string';
  }
  
  const typeMap = getTypeMap(databaseType);
  const mappedType = typeMap[type] || 'String';
  
  return {
    type: mappedType,
    length,
    precision,
    scale
  };
}



function getTypeMap(databaseType: DatabaseType): Record<string, string> {
  switch (databaseType) {
    case DatabaseType.MYSQL: return mySqlTypeMap;
    case DatabaseType.POSTGRESQL: return postgreSqlTypeMap;
    case DatabaseType.ORACLE: return oracleTypeMap;
    default: return mySqlTypeMap;
  }
}

export function toCamelCase(str: string): string {
  return str
    .replace(/[-_](\w)/g, (_, c) => c.toUpperCase())
    .replace(/^\w/, c => c.toLowerCase());
}

export function toPascalCase(str: string): string {
  const camel = toCamelCase(str);
  return camel.charAt(0).toUpperCase() + camel.slice(1);
}

export function getSampleSql(databaseType: DatabaseType): string {
  switch (databaseType) {
    case DatabaseType.MYSQL:
      return `CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY COMMENT '用户ID',
  username VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名',
  email VARCHAR(100) NOT NULL UNIQUE COMMENT '邮箱',
  password_hash VARCHAR(255) NOT NULL COMMENT '密码哈希',
  age TINYINT UNSIGNED COMMENT '年龄',
  is_active TINYINT(1) DEFAULT 1 COMMENT '是否激活',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';`;
    case DatabaseType.POSTGRESQL:
      return `CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  age INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`;
    case DatabaseType.ORACLE:
      return `CREATE TABLE users (
  id NUMBER(10) GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  username VARCHAR2(50) NOT NULL UNIQUE,
  email VARCHAR2(100) NOT NULL UNIQUE,
  password_hash VARCHAR2(255) NOT NULL,
  age NUMBER(3),
  is_active NUMBER(1) DEFAULT 1,
  created_at DATE DEFAULT SYSDATE,
  updated_at DATE DEFAULT SYSDATE
);`;
  }
  return '';
}
