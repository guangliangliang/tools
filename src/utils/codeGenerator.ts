import type { ParsedTable, Field } from './sqlParser';
import { toPascalCase, toCamelCase } from './sqlParser';

export enum Language {
  JAVA = 'java',
  PYTHON = 'python',
  CSHARP = 'csharp',
  GO = 'go'
}

export interface GeneratorOptions {
  language: Language;
  useLombok: boolean;
  useJpa: boolean;
  useDataAnnotations: boolean;
  useSqlAlchemy: boolean;
}

const javaTypeMap: Record<string, string> = {
  'String': 'String',
  'Integer': 'Integer',
  'Long': 'Long',
  'Float': 'Float',
  'Double': 'Double',
  'BigDecimal': 'java.math.BigDecimal',
  'LocalDate': 'java.time.LocalDate',
  'LocalTime': 'java.time.LocalTime',
  'LocalDateTime': 'java.time.LocalDateTime',
  'OffsetDateTime': 'java.time.OffsetDateTime',
  'Boolean': 'Boolean',
  'UUID': 'java.util.UUID',
  'byte[]': 'byte[]'
};

const pythonTypeMap: Record<string, string> = {
  'String': 'str',
  'Integer': 'int',
  'Long': 'int',
  'Float': 'float',
  'Double': 'float',
  'BigDecimal': 'float',
  'LocalDate': 'date',
  'LocalTime': 'time',
  'LocalDateTime': 'datetime',
  'OffsetDateTime': 'datetime',
  'Boolean': 'bool',
  'UUID': 'UUID',
  'byte[]': 'bytes'
};

const cSharpTypeMap: Record<string, string> = {
  'String': 'string',
  'Integer': 'int',
  'Long': 'long',
  'Float': 'float',
  'Double': 'double',
  'BigDecimal': 'decimal',
  'LocalDate': 'DateTime',
  'LocalTime': 'TimeSpan',
  'LocalDateTime': 'DateTime',
  'OffsetDateTime': 'DateTimeOffset',
  'Boolean': 'bool',
  'UUID': 'Guid',
  'byte[]': 'byte[]'
};

const goTypeMap: Record<string, string> = {
  'String': 'string',
  'Integer': 'int',
  'Long': 'int64',
  'Float': 'float32',
  'Double': 'float64',
  'BigDecimal': 'float64',
  'LocalDate': 'time.Time',
  'LocalTime': 'time.Time',
  'LocalDateTime': 'time.Time',
  'OffsetDateTime': 'time.Time',
  'Boolean': 'bool',
  'UUID': 'string',
  'byte[]': '[]byte'
};

export function generateCode(table: ParsedTable, options: GeneratorOptions): string {
  switch (options.language) {
    case Language.JAVA:
      return generateJava(table, options);
    case Language.PYTHON:
      return generatePython(table, options);
    case Language.CSHARP:
      return generateCSharp(table, options);
    case Language.GO:
      return generateGo(table, options);
    default:
      return generateJava(table, options);
  }
}

function generateJava(table: ParsedTable, options: GeneratorOptions): string {
  const lines: string[] = [];
  const className = toPascalCase(table.tableName);
  
  const imports = collectJavaImports(table, options);
  if (imports.length > 0) {
    imports.forEach(imp => lines.push(`import ${imp};`));
    lines.push('');
  }
  
  if (options.useLombok || options.useJpa) {
    lines.push('/**');
    lines.push(` * ${className} 实体类`);
    lines.push(' */');
  }
  
  if (options.useJpa) {
    lines.push(`@Entity`);
    lines.push(`@Table(name = "${table.originalTableName}")`);
  }
  
  if (options.useLombok) {
    lines.push(`@Data`);
    lines.push(`@NoArgsConstructor`);
    lines.push(`@AllArgsConstructor`);
  }
  
  lines.push(`public class ${className} {`);
  lines.push('');
  
  table.fields.forEach(field => {
    lines.push(`    /**`);
    lines.push(`     * ${field.comment || field.name}`);
    lines.push(`     */`);
    
    if (options.useJpa) {
      if (field.isPrimaryKey) {
        lines.push(`    @Id`);
        if (field.isAutoIncrement) {
          lines.push(`    @GeneratedValue(strategy = GenerationType.IDENTITY)`);
        }
      }
      lines.push(`    @Column(name = "${field.originalName}")`);
    }
    
    const javaType = getJavaType(field.type);
    lines.push(`    private ${javaType} ${field.name};`);
    lines.push('');
  });
  
  if (!options.useLombok) {
    table.fields.forEach(field => {
      const javaType = getJavaType(field.type);
      const capitalizedName = toPascalCase(field.name);
      
      lines.push(`    public ${javaType} get${capitalizedName}() {`);
      lines.push(`        return ${field.name};`);
      lines.push(`    }`);
      lines.push('');
      
      lines.push(`    public void set${capitalizedName}(${javaType} ${field.name}) {`);
      lines.push(`        this.${field.name} = ${field.name};`);
      lines.push(`    }`);
      lines.push('');
    });
    
    lines.push(`    public ${className}() {}`);
    lines.push('');
    
    const allArgs = table.fields.map(f => `${getJavaType(f.type)} ${f.name}`).join(', ');
    lines.push(`    public ${className}(${allArgs}) {`);
    table.fields.forEach(field => {
      lines.push(`        this.${field.name} = ${field.name};`);
    });
    lines.push(`    }`);
    lines.push('');
    
    lines.push(`    @Override`);
    lines.push(`    public String toString() {`);
    lines.push(`        return "${className}{" +`);
    table.fields.forEach((field, index) => {
      const comma = index < table.fields.length - 1 ? ' + ", "' : '';
      lines.push(`            "${field.name}=" + ${field.name}${comma} +`);
    });
    lines.push(`            "}";`);
    lines.push(`    }`);
  }
  
  lines.push('}');
  
  return lines.join('\n');
}

function collectJavaImports(table: ParsedTable, options: GeneratorOptions): string[] {
  const imports = new Set<string>();
  
  if (options.useLombok) {
    imports.add('lombok.AllArgsConstructor');
    imports.add('lombok.Data');
    imports.add('lombok.NoArgsConstructor');
  }
  
  if (options.useJpa) {
    imports.add('jakarta.persistence.*');
  }
  
  table.fields.forEach(field => {
    const type = field.type;
    if (type === 'BigDecimal') imports.add('java.math.BigDecimal');
    if (type === 'LocalDate') imports.add('java.time.LocalDate');
    if (type === 'LocalTime') imports.add('java.time.LocalTime');
    if (type === 'LocalDateTime') imports.add('java.time.LocalDateTime');
    if (type === 'OffsetDateTime') imports.add('java.time.OffsetDateTime');
    if (type === 'UUID') imports.add('java.util.UUID');
  });
  
  return Array.from(imports).sort();
}

function getJavaType(type: string): string {
  return javaTypeMap[type] || type;
}

function generatePython(table: ParsedTable, options: GeneratorOptions): string {
  const lines: string[] = [];
  const className = toPascalCase(table.tableName);
  
  lines.push('from dataclasses import dataclass');
  lines.push('from datetime import date, time, datetime');
  lines.push('from typing import Optional');
  lines.push('');
  
  lines.push('');
  lines.push('@dataclass');
  lines.push(`class ${className}:`);
  lines.push(`    """${className} 实体类"""`);
  lines.push('');
  
  table.fields.forEach(field => {
    const pythonType = getPythonType(field.type);
    const optional = field.isNullable ? 'Optional[' : '';
    const optionalClose = field.isNullable ? ']' : '';
    const defaultVal = field.isNullable ? ' = None' : '';
    
    lines.push(`    ${field.name}: ${optional}${pythonType}${optionalClose}${defaultVal}`);
    if (field.comment) {
      lines.push(`    """${field.comment}"""`);
    }
  });
  
  return lines.join('\n');
}

function getPythonType(type: string): string {
  return pythonTypeMap[type] || 'str';
}

function generateCSharp(table: ParsedTable, options: GeneratorOptions): string {
  const lines: string[] = [];
  const className = toPascalCase(table.tableName);
  
  lines.push('using System;');
  lines.push('');
  lines.push('');
  lines.push(`/// <summary>`);
  lines.push(`/// ${className} 实体类`);
  lines.push(`/// </summary>`);
  lines.push(`public class ${className}`);
  lines.push('{');
  
  table.fields.forEach(field => {
    const csType = getCSharpType(field.type);
    const nullable = field.isNullable ? '?' : '';
    const propName = toPascalCase(field.name);
    
    lines.push('');
    lines.push(`    /// <summary>`);
    lines.push(`    /// ${field.comment || field.name}`);
    lines.push(`    /// </summary>`);
    
    if (options.useDataAnnotations) {
      if (field.isPrimaryKey) {
        lines.push(`    [Key]`);
      }
      lines.push(`    [Column("${field.originalName}")]`);
    }
    
    lines.push(`    public ${csType}${nullable} ${propName} { get; set; }`);
  });
  
  lines.push('');
  lines.push('}');
  
  return lines.join('\n');
}

function getCSharpType(type: string): string {
  return cSharpTypeMap[type] || 'string';
}

function generateGo(table: ParsedTable, options: GeneratorOptions): string {
  const lines: string[] = [];
  const structName = toPascalCase(table.tableName);
  
  lines.push('package main');
  lines.push('');
  lines.push('import (');
  lines.push('    "time"');
  lines.push(')');
  lines.push('');
  lines.push('');
  lines.push(`// ${structName} ${structName} 实体类`);
  lines.push(`type ${structName} struct {`);
  
  table.fields.forEach(field => {
    const goType = getGoType(field.type);
    const fieldName = toPascalCase(field.name);
    const tags = [`db:"${field.originalName}"`];
    if (field.comment) {
      tags.push(`comment:"${field.comment}"`);
    }
    
    lines.push(`    ${fieldName} ${goType} \`${tags.join(' ')}\``);
  });
  
  lines.push('}');
  
  return lines.join('\n');
}

function getGoType(type: string): string {
  return goTypeMap[type] || 'string';
}
