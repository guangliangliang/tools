export enum DatabaseType {
  MYSQL = 'mysql',
  POSTGRESQL = 'postgresql',
  ORACLE = 'oracle'
}

export interface ConversionRule {
  pattern: RegExp
  replacement: string
  description?: string
}

interface DatabaseMapping {
  dataTypes: Record<string, string>
  functions: Record<string, string>
  rules: ConversionRule[]
}

const mySqlToPostgreSql: DatabaseMapping = {
  dataTypes: {
    'TINYINT\\(1\\)': 'BOOLEAN',
    'TINYINT': 'SMALLINT',
    'INT\\b': 'INTEGER',
    'DATETIME': 'TIMESTAMP',
    'JSON': 'JSONB'
  },
  functions: {
    'NOW\\(\\)': 'CURRENT_TIMESTAMP',
    'CURDATE\\(\\)': 'CURRENT_DATE',
    'IFNULL\\(': 'COALESCE('
  },
  rules: [
    {
      pattern: /LIMIT\s+(\d+)\s*,\s*(\d+)/gi,
      replacement: 'LIMIT $2 OFFSET $1',
      description: 'MySQL LIMIT → PostgreSQL'
    },
    {
      pattern: /`/g,
      replacement: '"',
      description: 'Backticks → quotes'
    },
    {
      pattern: /\bENGINE\s*=\s*\w+/gi,
      replacement: '',
      description: 'Remove ENGINE'
    },
    {
      pattern: /\bDEFAULT CHARSET\s*=\s*\w+/gi,
      replacement: '',
      description: 'Remove CHARSET'
    },
    {
      pattern: /\bAUTO_INCREMENT\b/gi,
      replacement: 'SERIAL',
      description: 'AUTO_INCREMENT → SERIAL'
    }
  ]
}

const postgreSqlToMySql: DatabaseMapping = {
  dataTypes: {
    'BOOLEAN': 'TINYINT(1)',
    'INTEGER': 'INT',
    'TIMESTAMP': 'DATETIME',
    'JSONB': 'JSON'
  },
  functions: {
    'CURRENT_TIMESTAMP': 'NOW()',
    'CURRENT_DATE': 'CURDATE()',
    'COALESCE\\(': 'IFNULL('
  },
  rules: [
    {
      pattern: /LIMIT\s+(\d+)\s+OFFSET\s+(\d+)/gi,
      replacement: 'LIMIT $2, $1',
      description: 'PostgreSQL LIMIT → MySQL'
    },
    {
      pattern: /"/g,
      replacement: '`',
      description: 'Quotes → backticks'
    },
    {
      pattern: /\bSERIAL\b/gi,
      replacement: 'INT AUTO_INCREMENT',
      description: 'SERIAL → AUTO_INCREMENT'
    }
  ]
}

const mySqlToOracle: DatabaseMapping = {
  dataTypes: {
    'TINYINT\\(1\\)': 'NUMBER(1)',
    'TINYINT': 'NUMBER(3)',
    'INT\\b': 'NUMBER(10)',
    'DATETIME': 'DATE',
    'VARCHAR\\((\\d+)\\)': 'VARCHAR2($1)',
    'TEXT': 'CLOB'
  },
  functions: {
    'NOW\\(\\)': 'SYSDATE',
    'CURDATE\\(\\)': 'TRUNC(SYSDATE)',
    'IFNULL\\(': 'NVL('
  },
  rules: [
    {
      pattern: /LIMIT\s+(\d+)/gi,
      replacement: 'FETCH FIRST $1 ROWS ONLY',
      description: 'LIMIT → FETCH FIRST'
    },
    {
      pattern: /LIMIT\s+(\d+)\s*,\s*(\d+)/gi,
      replacement: 'OFFSET $1 ROWS FETCH NEXT $2 ROWS ONLY',
      description: 'MySQL pagination → Oracle'
    },
    {
      pattern: /`/g,
      replacement: '"',
      description: 'Backticks → quotes'
    },
    {
      pattern: /\bAUTO_INCREMENT\b/gi,
      replacement: 'GENERATED ALWAYS AS IDENTITY',
      description: 'AUTO_INCREMENT → IDENTITY'
    },
    {
      pattern: /\bENGINE\s*=\s*\w+/gi,
      replacement: '',
      description: 'Remove ENGINE'
    },
    {
      pattern: /\bDEFAULT CHARSET\s*=\s*\w+/gi,
      replacement: '',
      description: 'Remove CHARSET'
    }
  ]
}

const oracleToMySql: DatabaseMapping = {
  dataTypes: {
    'NUMBER\\((\\d+),(\\d+)\\)': 'DECIMAL($1,$2)',
    'NUMBER\\((\\d+)\\)': 'INT',
    'NUMBER': 'DOUBLE',
    'DATE': 'DATETIME',
    'VARCHAR2\\((\\d+)\\)': 'VARCHAR($1)',
    'CLOB': 'TEXT'
  },
  functions: {
    'SYSDATE': 'NOW()',
    'NVL\\(': 'IFNULL('
  },
  rules: [
    {
      pattern: /FETCH\s+FIRST\s+(\d+)\s+ROWS\s+ONLY/gi,
      replacement: 'LIMIT $1',
      description: 'FETCH FIRST → LIMIT'
    },
    {
      pattern: /OFFSET\s+(\d+)\s+ROWS\s+FETCH\s+NEXT\s+(\d+)\s+ROWS\s+ONLY/gi,
      replacement: 'LIMIT $1, $2',
      description: 'Oracle pagination → MySQL'
    },
    {
      pattern: /"/g,
      replacement: '`',
      description: 'Quotes → backticks'
    },
    {
      pattern: /\bGENERATED\s+(?:ALWAYS|BY\s+DEFAULT)\s+AS\s+IDENTITY\b/gi,
      replacement: 'AUTO_INCREMENT',
      description: 'IDENTITY → AUTO_INCREMENT'
    }
  ]
}

const postgreSqlToOracle: DatabaseMapping = {
  dataTypes: {
    'BOOLEAN': 'NUMBER(1)',
    'SMALLINT': 'NUMBER(5)',
    'INTEGER': 'NUMBER(10)',
    'TIMESTAMP': 'TIMESTAMP',
    'VARCHAR\\((\\d+)\\)': 'VARCHAR2($1)',
    'TEXT': 'CLOB',
    'JSONB': 'CLOB'
  },
  functions: {
    'CURRENT_TIMESTAMP': 'SYSDATE',
    'CURRENT_DATE': 'TRUNC(SYSDATE)',
    'COALESCE\\(': 'NVL('
  },
  rules: [
    {
      pattern: /LIMIT\s+(\d+)/gi,
      replacement: 'FETCH FIRST $1 ROWS ONLY',
      description: 'LIMIT → FETCH FIRST'
    },
    {
      pattern: /LIMIT\s+(\d+)\s+OFFSET\s+(\d+)/gi,
      replacement: 'OFFSET $2 ROWS FETCH NEXT $1 ROWS ONLY',
      description: 'PostgreSQL pagination → Oracle'
    },
    {
      pattern: /\bSERIAL\b/gi,
      replacement: 'GENERATED ALWAYS AS IDENTITY',
      description: 'SERIAL → IDENTITY'
    }
  ]
}

const oracleToPostgreSql: DatabaseMapping = {
  dataTypes: {
    'NUMBER\\((\\d+),(\\d+)\\)': 'DECIMAL($1,$2)',
    'NUMBER\\((\\d+)\\)': 'INTEGER',
    'NUMBER': 'DOUBLE PRECISION',
    'DATE': 'TIMESTAMP',
    'VARCHAR2\\((\\d+)\\)': 'VARCHAR($1)',
    'CLOB': 'TEXT'
  },
  functions: {
    'SYSDATE': 'CURRENT_TIMESTAMP',
    'NVL\\(': 'COALESCE('
  },
  rules: [
    {
      pattern: /FETCH\s+FIRST\s+(\d+)\s+ROWS\s+ONLY/gi,
      replacement: 'LIMIT $1',
      description: 'FETCH FIRST → LIMIT'
    },
    {
      pattern: /OFFSET\s+(\d+)\s+ROWS\s+FETCH\s+NEXT\s+(\d+)\s+ROWS\s+ONLY/gi,
      replacement: 'LIMIT $2 OFFSET $1',
      description: 'Oracle pagination → PostgreSQL'
    },
    {
      pattern: /\bGENERATED\s+(?:ALWAYS|BY\s+DEFAULT)\s+AS\s+IDENTITY\b/gi,
      replacement: 'SERIAL',
      description: 'IDENTITY → SERIAL'
    }
  ]
}

const getMapping = (from: DatabaseType, to: DatabaseType): DatabaseMapping | null => {
  if (from === to) return null

  if (from === DatabaseType.MYSQL && to === DatabaseType.POSTGRESQL) return mySqlToPostgreSql
  if (from === DatabaseType.POSTGRESQL && to === DatabaseType.MYSQL) return postgreSqlToMySql
  if (from === DatabaseType.MYSQL && to === DatabaseType.ORACLE) return mySqlToOracle
  if (from === DatabaseType.ORACLE && to === DatabaseType.MYSQL) return oracleToMySql
  if (from === DatabaseType.POSTGRESQL && to === DatabaseType.ORACLE) return postgreSqlToOracle
  if (from === DatabaseType.ORACLE && to === DatabaseType.POSTGRESQL) return oracleToPostgreSql

  return null
}

export const convertSql = (sql: string, from: DatabaseType, to: DatabaseType): string => {
  if (!sql.trim() || from === to) return sql

  const mapping = getMapping(from, to)
  if (!mapping) return sql

  let result = sql

  Object.entries(mapping.dataTypes).forEach(([pattern, replacement]) => {
    const regex = new RegExp(`\\b${pattern}\\b`, 'gi')
    result = result.replace(regex, replacement)
  })

  Object.entries(mapping.functions).forEach(([pattern, replacement]) => {
    const regex = new RegExp(`\\b${pattern}`, 'gi')
    result = result.replace(regex, replacement)
  })

  mapping.rules.forEach((rule) => {
    result = result.replace(rule.pattern, rule.replacement)
  })

  return result
}

export const getDatabaseName = (type: DatabaseType): string => {
  switch (type) {
    case DatabaseType.MYSQL:
      return 'MySQL'
    case DatabaseType.POSTGRESQL:
      return 'PostgreSQL'
    case DatabaseType.ORACLE:
      return 'Oracle'
    default:
      return type
  }
}

export const getSampleSql = (type: DatabaseType): string => {
  switch (type) {
    case DatabaseType.MYSQL:
      return `CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE,
  age TINYINT,
  is_active TINYINT(1) DEFAULT 1,
  created_at DATETIME DEFAULT NOW(),
  metadata JSON
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO users (name, email, age) VALUES
  ('张三', 'zhangsan@example.com', 25),
  ('李四', 'lisi@example.com', 30);

SELECT * FROM users WHERE is_active = 1 ORDER BY created_at DESC LIMIT 10;`

    case DatabaseType.POSTGRESQL:
      return `CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE,
  age INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  metadata JSONB
);

INSERT INTO users (name, email, age) VALUES
  ('张三', 'zhangsan@example.com', 25),
  ('李四', 'lisi@example.com', 30);

SELECT * FROM users WHERE is_active = true ORDER BY created_at DESC LIMIT 10;`

    case DatabaseType.ORACLE:
      return `CREATE TABLE users (
  id NUMBER(10) GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name VARCHAR2(255) NOT NULL,
  email VARCHAR2(255) UNIQUE,
  age NUMBER(3),
  is_active NUMBER(1) DEFAULT 1,
  created_at DATE DEFAULT SYSDATE,
  metadata CLOB
);

INSERT INTO users (name, email, age) VALUES
  ('张三', 'zhangsan@example.com', 25),
  ('李四', 'lisi@example.com', 30);

SELECT * FROM users WHERE is_active = 1 ORDER BY created_at DESC FETCH FIRST 10 ROWS ONLY;`

    default:
      return ''
  }
}
