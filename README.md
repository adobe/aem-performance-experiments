# AEM 6.5 Performance Experiments

This repository contains a collection of experiments in a take-home lab format designed to highlight the performance impact of some AEM best practices. The content is intended for intermediate to advanced AEM developers and customizers.

## Goal

The goal of these experiments is to demonstrate the impact of best practices adoption in Adobe Experience Manager (AEM).

## Non-Goals

This repo does not attempt to prescribe a one-size-fits-all solution to optimize AEM performance. Due to the myriad use cases that AEM supports, it would be impossible to do so. Instead, pick and choose concepts from the below experiments and try them out on your project.

## Getting set up

You will need the following SDKs, tools, and apps installed to work through the experiments:

- Java `11.0.*`
- [JMeter](https://jmeter.apache.org/)
- [cURL](https://curl.haxx.se/)

You will also need a local AEM author setup:

- AEM 6.5 author instance running on `:4502`
  - Ideally, with the latest [Service Pack](https://docs.adobe.com/content/help/en/experience-manager-65/release-notes/service-pack/sp-release-notes.html) installed

# Experiments

## 1. `Performance gains of a Lucene property index`

In this experiment, we examine the before and after effects of creating a custom Lucene property index.

[⇨ Performance gains of a Lucene property index](experiments/lucene-property-index)

## 2. `Performance gains of simple query refinement`

In this experiment, we'll take a vague search query and see the performance boost achieved by narrowing its search criteria.

[⇨ Performance gains of a simple query refinement](experiments/query-refinement)

## 3. `Performance gains for Query Builder queries with large result sets`

In this experiment, we use [Query Builder's p.guessTotal](https://docs.adobe.com/content/help/en/experience-manager-65/developing/platform/query-builder/querybuilder-predicate-reference.html#root) to improve query performance. 

[⇨ Performance gains for large result sets](experiments/large-result-sets)

## 4. `Pagination on Result Sets`

In this experiment, we consider what customizers should do after their queries are optimized and they find their
search still takes a long time and returns a large set. 

[⇨ Pagination](experiments/pagination)

### Contributing

Contributions are welcomed! Read the [Contributing Guide](./.github/CONTRIBUTING.md) for more information.

### Licensing

This project is licensed under the Apache V2 License. See [LICENSE](LICENSE) for more information.
