#!/bin/bash


for i in {1..1500}
do
  echo $i

  chars=abcd1234ABCD

  for j in {1..8} ; do
    k+="${chars:RANDOM%${#chars}:1}"
  done

  curl -s -u admin:admin -F "jcr:primaryType=nt:unstructured" -F "id=9999$i" http://localhost:4502/content/search-test/searchtest_$k > /dev/null

  k=""
done
